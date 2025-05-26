package com.backend.ecommerce.dto.Response.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Sec404TransactionData {
    private String orderId; // Payment gateway's orderId
    private String paymentUrl;
    private double amount;
    private String description;
    private String customerEmail;
    @JsonProperty("partner") // Map the "partner" field
    private Sec404PartnerData partnerDetails; // Optional
    @JsonProperty("transaction") // Map the "transaction" field
    private Sec404TransactionDetails transactionDetails;
}