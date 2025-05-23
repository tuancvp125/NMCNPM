package com.backend.ecommerce.controller;

import com.backend.ecommerce.model.OrderStatus;
import com.backend.ecommerce.service.OrderService;
import com.backend.ecommerce.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/vnpay")
public class VnPayController {

    @Autowired
    private VNPayService vnPayService;
    @Autowired
    private OrderService orderService;
    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(
            @RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(request, amount, orderInfo, baseUrl);
        return ResponseEntity.ok().body(vnpayUrl);
    }

    @GetMapping("/payment-return")
    public String paymentCompleted(HttpServletRequest request, Model model) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        String redirectUrl = "http://localhost:5174";  // Link quay lại trang mua hàng

        // HTML động dựa trên paymentStatus
        String htmlResponse;
        if (paymentStatus == 1) {
            orderService.updateOrderStatus(Long.valueOf(orderInfo), OrderStatus.PAID);
            htmlResponse = "<html>" +
                    "<head>" +
                    "<title>Thanh toán thành công</title>" +
                    "<meta http-equiv='refresh' content='10;url=" + redirectUrl + "' />" +  // Chuyển hướng sau 10 giây
                    "</head>" +
                    "<body>" +
                    "<h1>Thanh toán thành công!</h1>" +
                    "<p>Mã đơn hàng: " + orderInfo + "</p>" +
                    "<p>Thời gian thanh toán: " + paymentTime + "</p>" +
                    "<p>Số giao dịch: " + transactionId + "</p>" +
                    "<p>Tổng giá trị: " + totalPrice + "</p>" +
                    "<p><a href='" + redirectUrl + "'>Nhấn vào đây để quay lại trang mua hàng.</a></p>" +
                    "</body>" +
                    "</html>";
        } else {
            htmlResponse = "<html>" +
                    "<head>" +
                    "<title>Thanh toán thất bại</title>" +
                    "<meta http-equiv='refresh' content='10;url=" + redirectUrl + "' />" +  // Chuyển hướng sau 10 giây
                    "</head>" +
                    "<body>" +
                    "<h1>Thanh toán thất bại!</h1>" +
                    "<p>Mã đơn hàng: " + orderInfo + "</p>" +
                    "<p>Thời gian thanh toán: " + paymentTime + "</p>" +
                    "<p>Số giao dịch: " + transactionId + "</p>" +
                    "<p>Tổng giá trị: " + totalPrice + "</p>" +
                    "<p><a href='" + redirectUrl + "'>Nhấn vào đây để quay lại trang mua hàng.</a></p>" +
                    "</body>" +
                    "</html>";
        }

        return htmlResponse;  // Trả về HTML động
    }



}
