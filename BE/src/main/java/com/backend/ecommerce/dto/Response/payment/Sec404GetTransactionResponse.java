package com.backend.ecommerce.dto.Response.payment;

import lombok.Data;

@Data
public class Sec404GetTransactionResponse {
    private boolean success;
    private Sec404TransactionData data; // Assuming the GET /escrow/:orderId returns similar data structure
    private String message;
}