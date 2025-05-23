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

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;


    @PostMapping("/checkout")
    public ResponseEntity<String> processCheckout(@RequestParam Integer userId,@RequestParam Long cartId, @RequestBody Address address, @RequestParam String paymentMethod) throws MessagingException {
        long orderId=orderService.checkout(userId,cartId, address,paymentMethod);
     return ResponseEntity.ok(String.valueOf(orderId));
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
