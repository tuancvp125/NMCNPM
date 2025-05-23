package com.backend.ecommerce.controller;


import com.backend.ecommerce.model.Role;
import com.backend.ecommerce.service.EmailService;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.service.UserService;
import com.backend.ecommerce.service.TwoFactorAuthService;
import com.backend.ecommerce.dto.Request.VerifyRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;


import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService mailService;
    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    @GetMapping
    public  ResponseEntity<User> getUserDetailsById(@RequestParam Integer id) {
        Optional<User> user = userService.findByUserId(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PutMapping("/{email}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable String email, @RequestParam Role newRole) {
        userService.updateUserRole(email, newRole);
        return ResponseEntity.ok("User role updated successfully.");
    }

    @PostMapping("/enable-2fa")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> enable2FA(@AuthenticationPrincipal User user) {
        try {
            String qrUrl = twoFactorAuthService.enable2FA(user);
            return ResponseEntity.ok(qrUrl);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/disable-2fa")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> disable2FA(@AuthenticationPrincipal User user) {
        try {
            String msg = twoFactorAuthService.disable2FA(user);
            return ResponseEntity.ok(msg);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/2fa-status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> get2FAStatus(@AuthenticationPrincipal User user) {
        Boolean isEnabled = Boolean.TRUE.equals(user.getTwoFactorEnabled());
        return ResponseEntity.ok(Map.of("enabled", isEnabled));
    }

}
