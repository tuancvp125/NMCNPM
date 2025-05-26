package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.ChatTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatTicketRepository extends JpaRepository<ChatTicket, Long> {
    Optional<ChatTicket> findByUserEmailAndProductId(String userEmail, String productId);
}
