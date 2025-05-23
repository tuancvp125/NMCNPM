package com.backend.ecommerce.service;


import com.backend.ecommerce.model.*;
import com.backend.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
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
            orderItem.setOrderedProductPrice(orderItem.getProduct());
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

}



