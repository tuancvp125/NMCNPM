package com.backend.ecommerce.service;

import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage save(ChatMessage message) {
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getUserHistory(String userEmail) {
        return chatMessageRepository.findBySenderEmailOrderByTimestampAsc(userEmail);
    }

    public List<ChatMessage> getAllMessages() {
        return chatMessageRepository.findAllByOrderByTimestampAsc();
    }
}
