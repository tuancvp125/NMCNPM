package com.backend.ecommerce.config;

import org.springframework.stereotype.Component;

@Component
public class Sec404PaymentConfig {

    public static String sec404_ApiBaseUrl = "http://42.96.5.54:5000/api/partner";
    public static String sec404_SecretToken = "c007eb19cac3309eacd88a46db56381ce17ac5662bb76be091e348c96be095df";
    public static String sec404_CreateTransactionPath = "/escrow/create";
    public static String sec404_CheckStatusPathPrefix = "/escrow/"; // Sẽ nối thêm orderId
    public static String sec404_BackendReturnUrlPath = "/api/sec404payment/callback"; // Đã sửa
    public static String sec404_PartnerTokenHeaderName = "X-Partner-Token";
}