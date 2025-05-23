package com.backend.ecommerce.controller;


import com.backend.ecommerce.dto.Response.CartResponse;
import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.CartItem;
import com.backend.ecommerce.model.Product;
import com.backend.ecommerce.repository.CartItemRepository;
import com.backend.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    
    @PostMapping("/create")
    public ResponseEntity<Cart> createCart(@RequestParam Integer user_id) {
        Cart cart = cartService.createCart(user_id);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/get")
    public ResponseEntity<CartResponse> getCartById(@RequestParam Long id) {
        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        // Tính tổng giá trị từ các CartItem
        List<CartItem> cartItems = cartService.getCartItems(cart);
        BigDecimal total = cartItems.stream()
                .map(item -> BigDecimal.valueOf(item.getProduct().getPrice())
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tạo DTO để trả về
        CartResponse response = new CartResponse(cart, total.doubleValue());
        return ResponseEntity.ok(response);
    }


    @GetMapping("/get/items")
    public ResponseEntity<List<CartItem>> getCartItems(@RequestParam Long cartId) {
        Cart cart = cartService.getCartById(cartId);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        List<CartItem> cartItems = cartService.getCartItems(cart);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add/items")
    public ResponseEntity<String> addCartItem(@RequestParam Long cartId, @RequestParam long productId, @RequestParam int quantity) {
        cartService.addCartItem(cartId,productId, quantity);
        return ResponseEntity.ok("Item added to cart");
    }

    @DeleteMapping("/remove/items")
    public ResponseEntity<?> removeCartItem(@RequestParam Long cartId, @RequestParam Long itemId) {
        cartService.removeCartItem(cartId,itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam Long id) {
        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        cartService.clearCart(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/item/quantity")
    public ResponseEntity<String> updateCartItemQuantity(
            @RequestParam Long cartId,
            @RequestParam Long itemId,
            @RequestParam int quantity) {
        try {
            // Gọi service để cập nhật số lượng
            String message = cartService.updateCartItemQuantity(cartId, itemId, quantity);
            return ResponseEntity.ok(message); // Trả về message từ service
        } catch (RuntimeException e) {
            // Trả lỗi nếu có vấn đề xảy ra
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping("/default")
    public ResponseEntity<Cart> getDefaultCart(@RequestParam Integer userId) {
        try {
            Cart defaultCart = cartService.getDefaultCartForUser(userId);
            return ResponseEntity.ok(defaultCart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }


}
