package com.backend.ecommerce.service;

import com.backend.ecommerce.dto.Request.ChatMessageRequest;
import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.model.ChatTicket;
import com.backend.ecommerce.repository.ChatMessageRepository;
import com.backend.ecommerce.repository.ChatTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatTicketRepository ticketRepo;
    private final ChatMessageRepository messageRepo;

    public ChatTicket getOrCreateTicket(String userEmail, String productId) {
        return ticketRepo.findByUserEmailAndProductId(userEmail, productId)
                .orElseGet(() -> {
                    ChatTicket newTicket = ChatTicket.builder()
                            .userEmail(userEmail)
                            .productId(productId)
                            .status("open")
                            .build();
                    return ticketRepo.save(newTicket);
                });
    }

    public ChatMessage saveMessage(ChatMessageRequest request) {
        ChatTicket ticket = getOrCreateTicket(request.getUserEmail(), request.getProductId());

        ChatMessage message = ChatMessage.builder()
                .ticket(ticket)
                .senderEmail(request.getIsFromAdmin() ? "admin" : request.getUserEmail())
                .content(request.getContent())
                .isFromAdmin(request.getIsFromAdmin())
                .build();

        return messageRepo.save(message);
    }

    public List<ChatMessage> getMessages(String userEmail, String productId) {
        Optional<ChatTicket> ticketOpt = ticketRepo.findByUserEmailAndProductId(userEmail, String.valueOf(productId));
        return ticketOpt.map(ticket -> messageRepo.findByTicketOrderByTimestampAsc(ticket)).orElse(List.of());
    }

}
