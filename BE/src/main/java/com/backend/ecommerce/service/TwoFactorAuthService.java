package com.backend.ecommerce.service;

import com.backend.ecommerce.model.User;
import com.backend.ecommerce.dto.Request.VerifyRequest;
import com.backend.ecommerce.repository.UserRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TwoFactorAuthService {

    @Autowired
    private final UserRepository userRepo;

    public String enable2FA(User user) {
        if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            throw new IllegalStateException("2FA is already enabled.");
        }

        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        GoogleAuthenticatorKey key = gAuth.createCredentials();

        user.setTwoFactorSecret(key.getKey());
        user.setTwoFactorEnabled(true);
        userRepo.save(user);

        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("GachaWorld", user.getEmail(), key);
    }

    public String disable2FA(User user) {
        if (!Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            throw new IllegalStateException("2FA is already disabled.");
        }

        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        user.setOtpFailedAttempts(0);
        user.setOtpLastAttempt(null);
        userRepo.save(user);

        return "2FA disabled successfully.";
    }
}
