package com.backend.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.context.annotation.Lazy;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.time.LocalDateTime; // Thêm import này

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "order",fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private String payment;

    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.INITIATED;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status") // Trạng thái riêng cho thanh toán
    private PaymentStatus paymentStatus;

    @Column(name = "payment_gateway_order_id") // ID giao dịch từ cổng thanh toán
    private String paymentGatewayOrderId;

    @Column(name = "payment_url", length = 1024) // URL thanh toán từ cổng thanh toán
    private String paymentUrl;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    // Getters and Setters cho các trường mới
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentGatewayOrderId() {
        return paymentGatewayOrderId;
    }

    public void setPaymentGatewayOrderId(String paymentGatewayOrderId) {
        this.paymentGatewayOrderId = paymentGatewayOrderId;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public LocalDateTime getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }

    @PreUpdate // Hoặc @PrePersist và @PreUpdate nếu cần cả lúc tạo
    protected void onUpdate() {
        this.lastUpdatedAt = LocalDateTime.now();
    }

    @JsonIgnore
    public OrderStatus getStatus() {
        return status;
    }

    public String getStatusDescription() {
        return status.getDescription();
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems.clear();
        if (orderItems != null) {
            this.orderItems.addAll(orderItems);
            orderItems.forEach(orderItem -> orderItem.setOrder(this));
        }
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public double calculateTotalAmount() {
        double totalAmount = 0.0;
        for (OrderItem orderItem : orderItems) {
            totalAmount += orderItem.getOrderedProductPrice();
        }
        return totalAmount;
    }
}
