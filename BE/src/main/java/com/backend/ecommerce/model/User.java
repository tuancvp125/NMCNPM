package com.backend.ecommerce.model;


import com.backend.ecommerce.token.Token;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Integer id;

    private String firstname;
    private String lastname;
    @Column
    private String email;
    @JsonIgnore
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @JsonIgnore
    private String link;
    @Column(name = "cart_id_default", nullable = false, columnDefinition = "BIGINT DEFAULT -1")
    private Long cartIdDefault = -1L;
    @Column
    private String phoneNumber;

    @JsonIgnore
    public String getVerificationToken() {
        return link;
    }

    public void setVerificationToken(String verificationToken) {
        this.link = verificationToken;
    }

    //resetPassword
    @JsonIgnore
    @Column(name = "reset_token")
    private String resetToken;

    @JsonIgnore
    @Column(name = "reset_token_expiration")
    private LocalDateTime resetTokenExpiration;
    //resetPassword

    //otp
    @JsonIgnore
    @Column(name = "login_otp")
    private String loginOtp;

    @Column(name = "otp_expiration")
    private LocalDateTime otpExpiration;

    @JsonIgnore
    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @JsonIgnore
    @Column(name = "otp_failed_attempts")
    private Integer  otpFailedAttempts = 0;

    @JsonIgnore
    @Column(name = "otp_last_attempt")
    private LocalDateTime otpLastAttempt;

    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled; // keep exposed if needed

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled;
    }
    //otp

    public Boolean getStatus() {
        return status;
    }
    @JsonIgnore
    private Boolean status;

    public void setStatus(Boolean status) {
        this.status = status;
    }


    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Token> tokens;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
          List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(this.getRole().name()));
        return authorities;
    }
    @JsonIgnore
    @Override
    public String getPassword() {
        return password;
    }
    @JsonIgnore
    @Override
    public String getUsername() {
        return email;
    }
    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }
}
