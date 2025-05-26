package com.backend.ecommerce.dto.Response.payment;

import lombok.Data;
import java.time.OffsetDateTime; // For "2023-12-07T10:30:00.000Z"

@Data
public class Sec404TransactionDetails {
    private String orderId; // This is the payment gateway's orderId
    private String status;  // e.g., "pending", "completed", "failed"
    private OffsetDateTime createdAt;
}