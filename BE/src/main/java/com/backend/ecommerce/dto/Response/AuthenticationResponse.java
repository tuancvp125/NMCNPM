package com.backend.ecommerce.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String name;
    private Integer userId;
    private String email;
    private String token;
    private String role;
    private Long defaultCartId;
    private String phoneNumber;
    private Boolean requiresOtp;
}
