package com.backend.ecommerce.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CaptchaService {

    private final String SECRET_KEY = "6LfflS0rAAAAAMR5aQAoYsnCEG9JjUM_tH9ZkoTi";
    private final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verifyCaptcha(String token) {
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", SECRET_KEY);
        requestBody.add("response", token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(VERIFY_URL, request, Map.class);

        if (response.getBody() != null) {
            System.out.println("Captcha verification response: " + response.getBody());
            return (Boolean) response.getBody().get("success");
        }
        return false;
    }
}
