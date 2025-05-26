package com.backend.ecommerce.service;

import com.backend.ecommerce.dto.Response.payment.Sec404CreateTransactionResponse;
import com.backend.ecommerce.dto.Response.payment.Sec404GetTransactionResponse;
import com.backend.ecommerce.model.Order; // Your Order entity

public interface Sec404PaymentService {
    Sec404CreateTransactionResponse createTransaction(Order order, String customerEmail);
    Sec404GetTransactionResponse checkTransactionStatus(String gatewayOrderId); // gatewayOrderId is the one from Sec404
}