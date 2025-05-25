package com.backend.ecommerce.controller;

import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat") // client send to /app/chat
    @SendTo("/topic/messages") // broadcast to all clients
    public ChatMessage sendMessage(ChatMessage message) {
        return chatService.save(message);
    }

    // User xem lịch sử của chính họ
    @GetMapping("/api/chat/user/{email}")
    public List<ChatMessage> getUserMessages(@PathVariable String email) {
        return chatService.getUserHistory(email);
    }

    // Admin xem toàn bộ
    @GetMapping("/api/chat/admin")
    public List<ChatMessage> getAllMessages() {
        return chatService.getAllMessages();
    }
}
