package com.backend.ecommerce.dto.Request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    private String sender;
    private String receiver;
    private String content;
}
