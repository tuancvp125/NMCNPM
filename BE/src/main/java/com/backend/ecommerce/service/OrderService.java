package com.backend.ecommerce.service;

import com.backend.ecommerce.Exception.ResourceNotFoundException;

import com.backend.ecommerce.model.*;
import com.backend.ecommerce.repository.*;
import com.backend.ecommerce.model.PaymentStatus; // Thêm import

import org.springframework.transaction.annotation.Transactional; // Sử dụng của Spring
import java.time.LocalDateTime; // Thêm import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(Long cartId, Address address, String paymentMethod) {
        // Find the cart with the given ID
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (!optionalCart.isPresent()) {
            throw new RuntimeException("Cart Not Found");
        }

        // Retrieve the cart and its items
        Cart cart = optionalCart.get();
        List<CartItem> cartItems = cart.getItems();

        // Validate product quantities
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException(
                        "Product " + product.getName() + " does not have enough stock. Available: "
                                + product.getQuantity() + ", Required: " + cartItem.getQuantity()
                );
            }
        }

        // Save the user's address
        Address savedAddress = addressRepository.save(address);

        // Create a new order and set its properties
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDate.now());
        order.setPayment(paymentMethod);
        order.setAddress(savedAddress);
        orderRepository.save(order);

        // Create a list to hold the order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Deduct stock for the product
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            product.setB_quantity(product.getB_quantity() + cartItem.getQuantity());
            productRepository.save(product);

            // Create and save the order item
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);

            double itemPrice = cartItem.getProduct().getPrice() * cartItem.getQuantity();
            orderItem.setOrderedProductPrice(itemPrice); // Dòng này giờ sẽ biên dịch thành công!            

            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }

        // Set the order's order items and total amount
        order.setOrderItems(orderItems);
        order.setTotalAmount(order.calculateTotalAmount());
        orderRepository.save(order);

        // Clear cart items and save the cart
        cart.clearItems();
        cartRepository.save(cart);

        return order;
    }

    /**
     * Method này dùng để TẠO bản ghi Order ban đầu cho thanh toán online.
     * Nó KHÔNG trừ kho, KHÔNG xóa giỏ hàng.
     * Chỉ tạo Order với trạng thái chờ và paymentStatus là PENDING.
     */
    @Transactional
    public Order createInitialOrderForOnlinePayment(Long cartId, Address address, String paymentMethod, User user) {
        Cart cart = cartRepository.findById(cartId) // Giả sử cartId là đủ, không cần check user ở đây vì checkout sẽ check
                .orElseThrow(() -> new ResourceNotFoundException("Cart Not Found with id: " + cartId));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create an order with an empty cart.");
        }

        // Kiểm tra số lượng (chưa trừ kho)
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException(
                        "Product " + product.getName() + " does not have enough stock. Available: "
                                + product.getQuantity() + ", Required: " + cartItem.getQuantity()
                );
            }
        }

        Address savedAddress = addressRepository.save(address);

        Order order = new Order();
        order.setUser(user); // User được truyền từ controller (đã xác thực)
        order.setOrderDate(LocalDate.now());
        order.setPayment(paymentMethod); // paymentMethod = "SEC404_PAYMENT"
        order.setAddress(savedAddress);
        order.setStatus(OrderStatus.INITIATED); // Trạng thái ban đầu của đơn hàng
        order.setPaymentStatus(PaymentStatus.PENDING); // Trạng thái thanh toán
        // order.setLastUpdatedAt(LocalDateTime.now()); // Sẽ tự động nếu có @PrePersist

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            // orderItem.setOrder(order); // Gán sau khi order có ID

            double itemPrice = cartItem.getProduct().getPrice() * cartItem.getQuantity();
            orderItem.setOrderedProductPrice(itemPrice); 

            orderItems.add(orderItem);
        }
        // Gán orderItems vào order trước khi tính tổng và lưu lần đầu
        order.setOrderItems(orderItems);
        order.setTotalAmount(order.calculateTotalAmount()); // Tính tổng tiền

        Order savedOrder = orderRepository.save(order); // Lưu order để lấy ID

        // Gán order đã lưu vào từng orderItem và lưu chúng
        for (OrderItem item : orderItems) { // Nên là orderItems đã tạo ở trên
            item.setOrder(savedOrder);
        }
        orderItemRepository.saveAll(orderItems);
        // savedOrder.setOrderItems(orderItems); // Không cần gán lại vì orderItems đã là list của order

        return savedOrder; // Trả về order đã được lưu với ID
    }


    /**
     * Cập nhật Order với thông tin từ cổng thanh toán sau khi gọi API tạo giao dịch của họ.
     */
    @Transactional
    public Order updateOrderWithPaymentGatewayDetails(Long orderId, String gatewayOrderId, String paymentUrlReceived) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setPaymentGatewayOrderId(gatewayOrderId);
        order.setPaymentUrl(paymentUrlReceived);
        // PaymentStatus vẫn là PENDING
        // order.setLastUpdatedAt(LocalDateTime.now()); // Sẽ tự động bởi @PreUpdate
        return orderRepository.save(order);
    }

    /**
     * Xử lý đơn hàng sau khi thanh toán online thành công.
     * Trừ kho, xóa giỏ hàng, cập nhật trạng thái, gửi email.
     */
    @Transactional
    public Order finalizeOrderAfterSuccessfulPayment(Long orderId) throws MessagingException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Kiểm tra để tránh xử lý lại
        if (order.getPaymentStatus() == PaymentStatus.PAID && order.getStatus() != OrderStatus.INITIATED) {
             // Nếu order status là INITIATED mà payment PAID thì vẫn cần xử lý tiếp (trừ kho, đổi status)
            if(order.getStatus() != OrderStatus.INITIATED) return order;
        }


        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.PROCESSING); // Hoặc PAID, CONFIRMED tùy theo quy trình của bạn
        // order.setLastUpdatedAt(LocalDateTime.now()); // Sẽ tự động

        // 1. TRỪ KHO SẢN PHẨM
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            int currentStock = product.getQuantity();
            int quantityToDeduct = item.getQuantity();
            if (currentStock < quantityToDeduct) {
                // Đây là trường hợp nghiêm trọng: hàng đã hết trong khi khách đang thanh toán
                // Cần có chiến lược xử lý: hoàn tiền, thông báo khách, đặt hàng sau...
                // Hiện tại: throw lỗi để admin/dev biết và xử lý thủ công
                throw new IllegalStateException("Critical Stock Issue: Product " + product.getName() +
                        " (ID: " + product.getId() + ") stock is " + currentStock +
                        " but required " + quantityToDeduct + " for paid order " + order.getId());
            }
            product.setQuantity(currentStock - quantityToDeduct);
            product.setB_quantity(product.getB_quantity() + quantityToDeduct); // Số lượng đã bán
            productRepository.save(product);
        }

        // 2. XÓA GIỎ HÀNG
        // Tìm giỏ hàng của user và xóa các item đã được đặt trong đơn hàng này.
        // Điều này giả định rằng đơn hàng được tạo từ một giỏ hàng cụ thể.
        // Nếu bạn có cartId được lưu trữ cùng với order (ví dụ khi tạo initial order), việc này sẽ dễ hơn.
        // Cách đơn giản: Tìm cart của user và xóa item dựa trên product ID và đảm bảo user là chủ cart
        Optional<Cart> optionalCart = cartRepository.findByUser(order.getUser());
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            List<CartItem> itemsToRemove = new ArrayList<>();
            for (OrderItem orderItem : order.getOrderItems()) {
                for (CartItem cartItem : cart.getItems()) {
                    if (cartItem.getProduct().getId().equals(orderItem.getProduct().getId())) {
                        // Có thể cần check thêm quantity nếu 1 sản phẩm có thể add nhiều lần vào cart
                        // với số lượng khác nhau và chỉ mua 1 phần.
                        // Hiện tại giả định xóa hết cartItem có product đó.
                        itemsToRemove.add(cartItem);
                        break; // Chuyển sang OrderItem tiếp theo
                    }
                }
            }
            if (!itemsToRemove.isEmpty()) {
                cart.getItems().removeAll(itemsToRemove); // Xóa các cart item đã tìm thấy
                // Nếu bạn có CartItemRepository và cascade không phải ALL từ Cart đến CartItem,
                // bạn cần xóa từng CartItem bằng cartItemRepository.delete(cartItem)
                cartRepository.save(cart);
            }
        }


        Order savedOrder = orderRepository.save(order);

        // 3. GỬI EMAIL XÁC NHẬN
        User orderUser = order.getUser();
        if (orderUser != null && orderUser.getEmail() != null) {
            try {
                // Sử dụng method gửi email đã có hoặc tạo method mới nhận Order object
                emailService.sendConfirmationEmail(savedOrder.getId(), orderUser.getEmail());
            } catch (MessagingException e) {
                System.err.println("Failed to send successful payment confirmation email for order: " + savedOrder.getId() + " - " + e.getMessage());
                // Ghi log, không nên để transaction bị rollback vì lỗi gửi mail
            }
        }
        return savedOrder;
    }

    /**
     * Xử lý khi thanh toán online thất bại.
     */
    @Transactional
    public Order handleFailedOnlinePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setPaymentStatus(PaymentStatus.FAILED);
        // Bạn có thể muốn đổi OrderStatus thành PAYMENT_FAILED hoặc CANCELLED
        // order.setStatus(OrderStatus.PAYMENT_FAILED);
        // order.setLastUpdatedAt(LocalDateTime.now()); // Sẽ tự động
        return orderRepository.save(order);
    }


    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public void deleteOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        orderItemRepository.deleteAll(order.getOrderItems());
        orderRepository.delete(order);
    }

    public long checkout(Integer userId, Long cartId, Address address, String paymentMethod) throws MessagingException {
        Order order = this.placeOrder(cartId, address,paymentMethod);

        Optional<User> savedUser = userRepository.findById(userId);

        if (savedUser.isPresent()) {
            emailService.sendConfirmationEmail(order.getId(), savedUser.get().getEmail());
            return order.getId();
        } else {
            throw new IllegalArgumentException("Invalid user id: " + userId);
        }
    }


    public List<Order> getOrdersByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUser(user);
        return orders;
    }

    public List<Order> getOrdersInCurrentMonth() {
        LocalDate start = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
        LocalDate end = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());
        return orderRepository.findByOrderDateBetween(start, end);
    }

    public List<Order> getOrdersInCurrentWeek() {
        LocalDate now = LocalDate.now();
        LocalDate start = now.with(java.time.DayOfWeek.MONDAY);
        LocalDate end = now.with(java.time.DayOfWeek.SUNDAY);
        return orderRepository.findByOrderDateBetween(start, end);
    }

    public List<Order> getOrdersInLastYear() {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusYears(1).plusDays(1); // last year from today's date
        return orderRepository.findByOrderDateBetween(start, end);
    }

    // Thêm các method helper nếu cần, ví dụ:
    public Optional<Order> findOrderById(Long orderId){
        return orderRepository.findById(orderId);
    }

    public Optional<Order> findOrderByIdAndUser(Long orderId, User user){
        // Cần thêm method này vào OrderRepository: Optional<Order> findByIdAndUser(Long id, User user);
        return orderRepository.findByIdAndUser(orderId, user);
    }

}



