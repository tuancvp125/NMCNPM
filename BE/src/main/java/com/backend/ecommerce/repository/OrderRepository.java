package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.Order;
import com.backend.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
    List<Order> findByOrderDateBetween(LocalDate start, LocalDate end);
    Optional<Order> findByIdAndUser(Long id, User user);
}
