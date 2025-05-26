package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.ChatMessage;
import com.backend.ecommerce.model.ChatTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByTicketOrderByTimestampAsc(ChatTicket ticket);
}
