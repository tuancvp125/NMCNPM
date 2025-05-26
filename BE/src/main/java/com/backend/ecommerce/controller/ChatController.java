package com.backend.ecommerce.controller;

import com.backend.ecommerce.dto.Request.ChatMessageRequest;
import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    @Autowired
    private final ChatService chatService;

    // Gửi tin nhắn mới
    @PostMapping("/send")
    public ResponseEntity <ChatMessage> sendMessage(@RequestBody ChatMessageRequest messageDTO) {
        ChatMessage message = chatService.saveMessage(messageDTO);
        return ResponseEntity.ok(message);
    }

    // Lấy toàn bộ lịch sử chat theo productId và email
    @GetMapping("/history")
    public ResponseEntity <List<ChatMessage>> getChatHistory(
            @RequestParam String userEmail,
            @RequestParam Long productId) {

        List<ChatMessage> messages = chatService.getMessages(userEmail, productId);
        if (messages.isEmpty()) {
            return ResponseEntity.noContent().build(); // hoặc ok(Collections.emptyList()) nếu muốn trả rỗng
        } else {
            return ResponseEntity.ok(messages);
        }
    }
}

