package com.backend.ecommerce.service;

import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DefaultCartJobService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    public void updateDefaultCarts() {
        // Lấy danh sách người dùng có cart_id_default = -1
        List<User> users = userRepository.findByCartIdDefault(-1L);

        for (User user : users) {
            Cart defaultCart = cartService.createCart(user.getId());
            user.setCartIdDefault(defaultCart.getId());

            userRepository.save(user);
            System.out.println("Created default cart for user ID: " + user.getId() + ", Cart ID: " + defaultCart.getId());
        }
    }
}
