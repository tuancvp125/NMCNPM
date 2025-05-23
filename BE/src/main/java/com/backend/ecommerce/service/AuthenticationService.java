package com.backend.ecommerce.service;

import com.backend.ecommerce.dto.Request.AuthenticationRequest;
import com.backend.ecommerce.dto.Request.RegisterRequest;
import com.backend.ecommerce.dto.Response.AuthenticationResponse;
import com.backend.ecommerce.model.Role;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.TokenRepository;
import com.backend.ecommerce.repository.UserRepository;
import com.backend.ecommerce.token.Token;
import com.backend.ecommerce.token.TokenType;
import com.backend.ecommerce.dto.Request.VerifyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.backend.ecommerce.dto.Request.PasswordResetRequest;
import com.backend.ecommerce.dto.Request.SetNewPasswordRequest;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Random;
import java.time.Duration;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final TokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired

    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired

    private EmailService emailService;
    @Autowired
    private CartService cartService;

    @Autowired
    private CaptchaService captchaService;


    public String registerUser(RegisterRequest request) throws MessagingException {
        boolean userExists = userRepository.existsByEmail(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists.");
        }
        String verificationToken = UUID.randomUUID().toString();

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .status(false)
                .link(verificationToken)
                .password(passwordEncoder.encode(request.getPassword()))
                .cartIdDefault(-1L)
                .role(Role.USER)
                .phoneNumber(request.getPhoneNumber())
                .build();
        var savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);
        return "Verify you email";
    }

    //sendPasswordResetToken
    public void sendPasswordResetToken(PasswordResetRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No user found with this email"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiration(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        try {
            emailService.sendResetPasswordEmail(user.getEmail(), token);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send reset email", e);
        }
    }

    public String resetPassword(SetNewPasswordRequest request) {
        var user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (user.getResetTokenExpiration() == null || user.getResetTokenExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiration(null);
        userRepository.save(user);

        return "Password has been reset successfully";
    }
    //Reset token

    //verify otp
    public AuthenticationResponse verifyOtp(VerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        Integer failedAttempts = user.getOtpFailedAttempts() != null ? user.getOtpFailedAttempts() : 0;

        if (failedAttempts >= 5 &&
                user.getOtpLastAttempt() != null &&
                Duration.between(user.getOtpLastAttempt(), now).toMinutes() < 5) {
            throw new RuntimeException("Too many failed attempts. Try again later.");
        }

        if (user.getLoginOtp() == null ||
                !user.getLoginOtp().trim().equals(String.valueOf(request.getCode()).trim()) ||
                user.getOtpExpiration() == null ||
                user.getOtpExpiration().isBefore(now)) {
            
            int currentFails = user.getOtpFailedAttempts() != null ? user.getOtpFailedAttempts() : 0;
            user.setOtpFailedAttempts(currentFails + 1);
            user.setOtpLastAttempt(now);
            userRepository.save(user);

            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setLoginOtp(null);
        user.setOtpExpiration(null);
        user.setOtpFailedAttempts(0);
        user.setOtpLastAttempt(null);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().toString())
                .defaultCartId(user.getCartIdDefault())
                .userId(user.getId())
                .name(user.getFirstname() + " " + user.getLastname())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    private static final SecureRandom secureRandom;
    static {
        SecureRandom tempRandom;
        try {
            tempRandom = SecureRandom.getInstanceStrong(); 
        } catch (NoSuchAlgorithmException e) {
        tempRandom = new SecureRandom(); // Fallback to default SecureRandom
        }
        secureRandom = tempRandom;
    }

    //verify otp

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        if (user.getStatus() == false) {
            throw new RuntimeException("User Didn't verify");
        }

        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            // Generate and send email OTP
            String otp = String.format("%06d", secureRandom.nextInt(999999));
            user.setLoginOtp(otp);
            user.setOtpExpiration(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            try {
                emailService.sendLoginOtpEmail(user.getEmail(), otp);
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send OTP", e);
            }

            return AuthenticationResponse.builder()
                    .requiresOtp(true)
                    .email(user.getEmail())
                    .build();
        }

        cartService.getCart(user.getId());
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().toString())
                .defaultCartId(user.getCartIdDefault())
                .userId(user.getId())
                .name(user.getFirstname() + " " + user.getLastname())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
    public void logout(String token) {
        var storedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        storedToken.setExpired(true);
        storedToken.setRevoked(true);
        tokenRepository.save(storedToken);
    }

    public boolean isTokenValid(String token) {
        try {
            var storedToken = tokenRepository.findByToken(token);
            if (storedToken.isEmpty()) {
                return false; // Token không tồn tại
            }

            Token tokenEntity = storedToken.get();
            return !tokenEntity.isExpired() && !tokenEntity.isRevoked();
        } catch (Exception ex){
            throw ex;
        }
    }
}
