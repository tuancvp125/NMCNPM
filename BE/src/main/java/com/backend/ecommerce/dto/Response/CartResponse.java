package com.backend.ecommerce.dto.Response;

import com.backend.ecommerce.model.Cart;
import lombok.Data;

@Data
public class CartResponse {
    private Cart cart;
    private Double total;

    public CartResponse(Cart cart, Double total) {
        this.cart = cart;
        this.total = total;
    }
}

