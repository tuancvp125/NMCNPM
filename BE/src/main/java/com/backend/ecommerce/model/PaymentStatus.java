package com.backend.ecommerce.model;

public enum PaymentStatus {
    PENDING,    // Chờ thanh toán
    PAID,       // Thanh toán thành công
    FAILED,     // Thanh toán thất bại
    CANCELED    // Đã hủy bởi người dùng hoặc hết hạn
}