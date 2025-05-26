package com.backend.ecommerce.dto.Request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    private String userEmail;
    private String productId;
    private String content;
    private boolean isFromAdmin;
}
