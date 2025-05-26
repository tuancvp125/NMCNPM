package com.backend.ecommerce.controller;

import com.backend.ecommerce.model.*;
import com.backend.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;


    @PostMapping("/checkout")
    public ResponseEntity<String> processCheckout(@RequestParam Integer userId,@RequestParam Long cartId, @RequestBody Address address, @RequestParam String paymentMethod) throws MessagingException {
        long orderId = orderService.checkout(userId,cartId, address,paymentMethod);
        return ResponseEntity.ok(String.valueOf(orderId));
        // if ("SEC404_PAYMENT".equalsIgnoreCase(paymentMethod)) {
        //     // Trả về orderId để frontend biết và gọi tiếp API initiate của Sec404
        //     // Có thể trả về một object chứa orderId và một flag/message
        //     return ResponseEntity.ok().body(Map.of(
        //         "message", "Order initiated for Sec404Payment. Proceed to payment initiation.",
        //         "orderId", orderId,
        //         "paymentMethod", paymentMethod
        //     ));
        // } else if ("COD".equalsIgnoreCase(paymentMethod)) {
        //     return ResponseEntity.ok().body(Map.of(
        //         "message", "Order placed successfully with COD.",
        //         "orderId", orderId,
        //         "paymentMethod", paymentMethod
        //     ));
        // } else {
        //     return ResponseEntity.badRequest().body("Unsupported payment method at checkout.");
        // }    
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrderById(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getOrdersByUserId(@RequestParam Integer userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(orders);
        }
    }

}
