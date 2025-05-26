package com.backend.ecommerce.service;

import com.backend.ecommerce.config.Sec404PaymentConfig;
import com.backend.ecommerce.dto.Request.payment.Sec404CreateTransactionRequest;
import com.backend.ecommerce.dto.Response.payment.Sec404CreateTransactionResponse;
import com.backend.ecommerce.dto.Response.payment.Sec404GetTransactionResponse;
import com.backend.ecommerce.model.Order;
import com.backend.ecommerce.service.Sec404PaymentService; // Import interface
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service; // <<<<----- QUAN TRỌNG
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service // <<<<----- ANNOTATION NÀY PHẢI CÓ
public class Sec404PaymentServiceImpl implements Sec404PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(Sec404PaymentServiceImpl.class);

    private final RestTemplate restTemplate;

    @Value("${app.url}")
    private String appBaseUrl;

    // Constructor để inject RestTemplate
    public Sec404PaymentServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public Sec404CreateTransactionResponse createTransaction(Order order, String customerEmail) {
        String apiUrl = Sec404PaymentConfig.sec404_ApiBaseUrl + Sec404PaymentConfig.sec404_CreateTransactionPath;
        String specificReturnUrl = appBaseUrl + Sec404PaymentConfig.sec404_BackendReturnUrlPath +
                                   "?internalOrderId=" + order.getId();

        Sec404CreateTransactionRequest requestPayload = new Sec404CreateTransactionRequest(
                customerEmail,
                order.getTotalAmount(),
                "Thanh toan cho don hang #" + order.getId(),
                specificReturnUrl
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(Sec404PaymentConfig.sec404_PartnerTokenHeaderName, Sec404PaymentConfig.sec404_SecretToken);

        HttpEntity<Sec404CreateTransactionRequest> entity = new HttpEntity<>(requestPayload, headers);

        try {
            logger.info("Sending create transaction request to Sec404Payment: URL={}, Payload={}", apiUrl, requestPayload);
            ResponseEntity<Sec404CreateTransactionResponse> response = restTemplate.postForEntity(apiUrl, entity, Sec404CreateTransactionResponse.class);
            logger.info("Received response from Sec404Payment create transaction: {}", response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // ... (xử lý lỗi) ...
            Sec404CreateTransactionResponse errorResponse = new Sec404CreateTransactionResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("API Call Failed: " + e.getResponseBodyAsString());
             logger.error("Error calling Sec404Payment create API: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return errorResponse;
        } catch (Exception e) {
            // ... (xử lý lỗi) ...
             Sec404CreateTransactionResponse errorResponse = new Sec404CreateTransactionResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Unexpected error: " + e.getMessage());
            logger.error("Unexpected error calling Sec404Payment create API", e);
            return errorResponse;
        }
    }

    @Override
    public Sec404GetTransactionResponse checkTransactionStatus(String gatewayOrderId) {
        String apiUrl = Sec404PaymentConfig.sec404_ApiBaseUrl + Sec404PaymentConfig.sec404_CheckStatusPathPrefix + gatewayOrderId;
        HttpHeaders headers = new HttpHeaders();
        headers.set(Sec404PaymentConfig.sec404_PartnerTokenHeaderName, Sec404PaymentConfig.sec404_SecretToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            logger.info("Sending check status request to Sec404Payment for gatewayOrderId: {}", gatewayOrderId);
            ResponseEntity<Sec404GetTransactionResponse> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, Sec404GetTransactionResponse.class);
            logger.info("Received response from Sec404Payment check status: {}", response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // ... (xử lý lỗi) ...
             Sec404GetTransactionResponse errorResponse = new Sec404GetTransactionResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("API Call Failed: " + e.getResponseBodyAsString());
            logger.error("Error calling Sec404Payment check status API for gatewayOrderId {}: {} - {}", gatewayOrderId, e.getStatusCode(), e.getResponseBodyAsString(), e);
            return errorResponse;
        } catch (Exception e) {
            // ... (xử lý lỗi) ...
            Sec404GetTransactionResponse errorResponse = new Sec404GetTransactionResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Unexpected error: " + e.getMessage());
            logger.error("Unexpected error calling Sec404Payment check status API for gatewayOrderId {}", gatewayOrderId, e);
            return errorResponse;
        }
    }
}