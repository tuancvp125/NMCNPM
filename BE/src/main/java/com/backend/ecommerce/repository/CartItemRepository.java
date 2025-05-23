package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
