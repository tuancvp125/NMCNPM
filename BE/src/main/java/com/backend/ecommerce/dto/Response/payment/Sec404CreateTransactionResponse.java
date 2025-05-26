package com.backend.ecommerce.dto.Response.payment;

import lombok.Data;

@Data
public class Sec404CreateTransactionResponse {
    private boolean success;
    private Sec404TransactionData data;
    private String message; // For errors
}