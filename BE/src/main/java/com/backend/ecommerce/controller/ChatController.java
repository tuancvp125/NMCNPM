package com.backend.ecommerce.controller;

import com.backend.ecommerce.dto.Request.ChatMessageRequest;
import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Gửi tin nhắn text (JSON)
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessageRequest messageDTO) {
        ChatMessage message = chatService.saveTextMessage(messageDTO);
        return ResponseEntity.ok(message);
    }

    // Gửi file đính kèm (multipart/form-data)
    @PostMapping("/send-file")
    public ResponseEntity<ChatMessage> sendFileMessage(
        @RequestParam("userEmail") String userEmail,
        @RequestParam("productId") String productId,
        @RequestParam("isFromAdmin") boolean isFromAdmin,
        @RequestParam("file") MultipartFile file) {

        try {
            ChatMessage message = chatService.saveFileMessage(userEmail, productId, file, isFromAdmin);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Lấy lịch sử chat
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @RequestParam String userEmail,
            @RequestParam String productId) {

        List<ChatMessage> messages = chatService.getMessages(userEmail, productId);
        if (messages.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(messages);
        }
    }
}
