package com.backend.ecommerce.model;

public enum OrderStatus {
    INITIATED("Khởi tạo"),
    SHIPPING("Đang giao"),
    PAID("Đã thanh toán"),
    COMPLETED("Hoàn thành"),

    CANCELED("Đã huỷ");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
