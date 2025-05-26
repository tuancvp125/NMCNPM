package com.backend.ecommerce.dto.Request.payment; // Or your DTO package

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sec404CreateTransactionRequest {
    private String customerEmail;
    private double amount;
    private String description;
    private String returnUrl;
    // private Object metadata; // Optional
}