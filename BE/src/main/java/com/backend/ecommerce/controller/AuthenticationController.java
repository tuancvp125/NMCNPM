package com.backend.ecommerce.controller;


import com.backend.ecommerce.dto.Request.AuthenticationRequest;
import com.backend.ecommerce.dto.Request.RegisterRequest;
import com.backend.ecommerce.dto.Response.AuthenticationResponse;
import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.UserRepository;
import com.backend.ecommerce.service.AuthenticationService;
import com.backend.ecommerce.service.CaptchaService;
import com.backend.ecommerce.service.TwoFactorAuthService;
import com.backend.ecommerce.dto.Request.PasswordResetRequest;
import com.backend.ecommerce.dto.Request.SetNewPasswordRequest;
import com.backend.ecommerce.dto.Request.VerifyRequest;

import com.backend.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

import javax.mail.MessagingException;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;
    private final AuthenticationService authenticationService;
    @Autowired
    private CartService cartService;
    @Autowired
    private CaptchaService captchaService;
    @Autowired
    private TwoFactorAuthService twoFactorAuthService;



    @PostMapping("/sign-up")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) throws MessagingException {
        String message = authenticationService.registerUser(request);
        return ResponseEntity.ok(message);
    }



    @PostMapping("/sign-in")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        boolean isCaptchaValid = captchaService.verifyCaptcha(request.getCaptchaToken());

        if (!isCaptchaValid) {
            return ResponseEntity.badRequest().body("Invalid reCAPTCHA");
        }

        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String verificationToken) {
        Optional<User> optionalUser = userRepository.findByLink(verificationToken);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }

        User user = optionalUser.get();
        user.setStatus(true);
        user.setVerificationToken(null);

        // Tạo giỏ hàng mặc định
        Cart defaultCart = cartService.createCart(user.getId());
        user.setCartIdDefault(defaultCart.getId()); // Lưu ID giỏ hàng mặc định

        userRepository.save(user);

        return ResponseEntity.ok("Your email has been verified. A default cart has been created.");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(false); // Trả về false nếu header không hợp lệ
        }

        String token = authorizationHeader.substring(7); // Lấy token sau "Bearer "
        try {
            boolean isValid = authenticationService.isTokenValid(token);
            return ResponseEntity.ok(isValid);
        }
        catch (Exception ex){
            return ResponseEntity.ok(false);
        }

    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token format");
        }

        String token = authorizationHeader.substring(7); // Lấy token sau "Bearer "
        authenticationService.logout(token);
        return ResponseEntity.ok("User has been logged out successfully.");
    }

    //Request password reset
    @PostMapping("/password-reset-request")
    public ResponseEntity<String> requestReset(@RequestBody PasswordResetRequest request) {
        authenticationService.sendPasswordResetToken(request);
        return ResponseEntity.ok("Reset link sent to your email.");
    }

    //Set new password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody SetNewPasswordRequest request) {
        return ResponseEntity.ok(authenticationService.resetPassword(request));
    }

    //OTP
    @PostMapping("/verify-login-otp")
    public ResponseEntity<AuthenticationResponse> verifyLoginOtp(@RequestBody VerifyRequest request) {
        return ResponseEntity.ok(authenticationService.verifyOtp(request));
    }
    //OTP

}
