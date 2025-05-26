package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.CartItem;
import com.backend.ecommerce.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user); // THÊM METHOD NÀY
    Optional<Cart> findByUserId(int userId);
}
