package com.backend.ecommerce.dto.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String sender;
    private String receiver;
    private String content;
    private String status;  // e.g., "sent", "failed"
}
