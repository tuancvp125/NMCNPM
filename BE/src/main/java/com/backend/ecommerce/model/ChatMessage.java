package com.backend.ecommerce.model;

import lombok.*;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;

    private String senderEmail;   // email của user hoặc "admin"
    private String content;

    @Column(nullable = false)
    private Boolean isFromAdmin; // 1 nếu admin gửi, 0 nếu user gửi

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    @JsonIgnore // Để tránh vòng lặp vô hạn khi serialize
    private ChatTicket ticket; //Bug ở chỗ này dcm???

    @PrePersist
    public void setTimestamp() {
        this.timestamp = LocalDateTime.now();
    }
}
