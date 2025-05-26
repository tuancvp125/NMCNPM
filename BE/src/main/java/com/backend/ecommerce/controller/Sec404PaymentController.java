package com.backend.ecommerce.controller;

import com.backend.ecommerce.Exception.ResourceNotFoundException;

import com.backend.ecommerce.dto.Response.PaymentInitiationResponse;
import com.backend.ecommerce.dto.Response.payment.Sec404CreateTransactionResponse;
import com.backend.ecommerce.dto.Response.payment.Sec404GetTransactionResponse;
import com.backend.ecommerce.dto.Response.payment.Sec404TransactionData;

import com.backend.ecommerce.model.Order;
import com.backend.ecommerce.model.OrderStatus; // Enum trạng thái đơn hàng của bạn
import com.backend.ecommerce.model.PaymentStatus;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.model.Address; // Thêm import Address
import com.backend.ecommerce.model.Cart; // Thêm import Cart

import com.backend.ecommerce.repository.CartRepository; // Thêm CartRepository
import com.backend.ecommerce.repository.UserRepository; // Hoặc UserService

import com.backend.ecommerce.service.OrderService; // Service để xử lý nghiệp vụ Order
import com.backend.ecommerce.service.Sec404PaymentService;



// import jakarta.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponse;
import javax.mail.MessagingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Giả sử dùng Spring Security
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/sec404payment")
public class Sec404PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(Sec404PaymentController.class);

    private final Sec404PaymentService sec404PaymentService;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final CartRepository cartRepository; // Thêm CartRepository

    @Autowired
    public Sec404PaymentController(Sec404PaymentService sec404PaymentService,
                                   OrderService orderService,
                                   UserRepository userRepository,
                                   CartRepository cartRepository) { // Thêm CartRepository
        this.sec404PaymentService = sec404PaymentService;
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository; // Khởi tạo
    }

    @GetMapping("/test-mapping")
    public ResponseEntity<String> testMapping() {
        logger.info("Sec404PaymentController /test-mapping endpoint was hit!");
        return ResponseEntity.ok("Sec404 Test Mapping OK");
    }

    /**
     * Endpoint này sẽ được frontend gọi khi người dùng chọn thanh toán bằng Sec404.
     * Nó sẽ tạo đơn hàng ban đầu VÀ khởi tạo giao dịch với Sec404.
     */
    @PostMapping("/initiate-checkout") // Đổi tên endpoint cho rõ ràng
    @Transactional
    public ResponseEntity<?> initiateCheckoutAndPayment(
            // Thông tin cần để tạo đơn hàng ban đầu
            @RequestParam Long cartId,      // ID của giỏ hàng
            @RequestBody Address address,   // Địa chỉ giao hàng
            // Authentication để lấy user đang đăng nhập
            Authentication authentication) {

        String userEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Bước 1: Tạo đơn hàng ban đầu với trạng thái PENDING PAYMENT
        Order order;
        try {
            // Gọi method mới trong OrderService để tạo đơn hàng chờ thanh toán
            order = orderService.createInitialOrderForOnlinePayment(cartId, address, "SEC404_PAYMENT", currentUser);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Error creating initial order for cartId {}: {}", cartId, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        if (order == null || order.getId() == null) {
            logger.error("Failed to create initial order for cartId {}", cartId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create order.");
        }

        logger.info("Initial order created with ID: {} for Sec404Payment.", order.getId());

        // Bước 2: Khởi tạo giao dịch với Sec404Payment
        if (order.getTotalAmount() < 1000) { // Kiểm tra lại tổng tiền trước khi gọi Sec404
            // Có thể hủy đơn hàng vừa tạo hoặc đánh dấu lỗi
            orderService.handleFailedOnlinePayment(order.getId()); // Đánh dấu payment failed
            return ResponseEntity.badRequest().body("Order " + order.getId() + " amount is less than 1,000 VND.");
        }

        Sec404CreateTransactionResponse paymentResponse = sec404PaymentService.createTransaction(order, currentUser.getEmail());

        if (paymentResponse != null && paymentResponse.isSuccess() && paymentResponse.getData() != null && paymentResponse.getData().getPaymentUrl() != null) {
            // Cập nhật order với thông tin từ cổng thanh toán
            orderService.updateOrderWithPaymentGatewayDetails(
                    order.getId(),
                    paymentResponse.getData().getOrderId(), // Gateway's order ID
                    paymentResponse.getData().getPaymentUrl()
            );
            // Trả về URL để frontend redirect
            return ResponseEntity.ok(new PaymentInitiationResponse(paymentResponse.getData().getPaymentUrl()));
        } else {
            String errorMessage = (paymentResponse != null && paymentResponse.getMessage() != null)
                                  ? paymentResponse.getMessage()
                                  : "Failed to initiate payment with Sec404Payment.";
            logger.error("Failed to initiate Sec404Payment for order {}: {}", order.getId(), errorMessage);
            orderService.handleFailedOnlinePayment(order.getId()); // Cập nhật trạng thái thất bại cho order
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    // Endpoint callback giữ nguyên như trước
    @GetMapping("/callback")
    @Transactional
    public ResponseEntity<?> paymentCallback(
            @RequestParam("internalOrderId") Long internalOrderId,
            HttpServletResponse httpServletResponse) throws IOException {
        // ... (logic callback như đã cung cấp ở phản hồi trước)
        // Sẽ gọi:
        // - sec404PaymentService.checkTransactionStatus(...)
        // - orderService.finalizeOrderAfterSuccessfulPayment(...) hoặc orderService.handleFailedOnlinePayment(...)
        // ...
        logger.info("Received Sec404Payment callback for internalOrderId: {}", internalOrderId);

        Order order = orderService.findOrderById(internalOrderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            return ResponseEntity.ok("Order already paid");
        }

        // Gọi Sec404 để kiểm tra trạng thái
        Sec404GetTransactionResponse statusResponse = sec404PaymentService.checkTransactionStatus(order.getPaymentGatewayOrderId());

        if (statusResponse == null || !statusResponse.isSuccess()) {
            orderService.handleFailedOnlinePayment(order.getId());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed");
        }

        String status = statusResponse.getData().getTransactionDetails().getStatus();
        switch (status.toLowerCase()) {
            case "completed":
            case "paid":
            case "success":
                try {
                    orderService.finalizeOrderAfterSuccessfulPayment(order.getId());
                    String redirectUrl = "http://localhost:5173";
                    String htmlResponse = "<html>" +
                            "<head>" +
                            "<meta http-equiv='refresh' content='2;url=" + redirectUrl + "' />" +
                            "<title>Redirecting...</title>" +
                            "</head>" +
                            "<body>" +
                            "<h2>Payment successful!</h2>" +
                            "<p>You will be redirected shortly. If not, <a href='" + redirectUrl + "'>click here</a>.</p>" +
                            "</body>" +
                            "</html>";

                    return ResponseEntity
                            .ok()
                            .header("Content-Type", "text/html; charset=UTF-8")
                            .body(htmlResponse);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error after payment: " + e.getMessage());
                }
            case "pending":
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Payment is still pending");
            default:
                orderService.handleFailedOnlinePayment(order.getId());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed: " + status);
        }
    }
}