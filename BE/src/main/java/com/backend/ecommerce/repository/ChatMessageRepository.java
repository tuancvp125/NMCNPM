package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySenderEmailOrderByTimestampAsc(String senderEmail);

    List<ChatMessage> findAllByOrderByTimestampAsc(); // nếu admin muốn xem toàn bộ
}
