package com.budgie.bff.config;

import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class PlaidLinkConfig {

    @Value("${plaid.clientId}")
    private String clientId;

    @Value("${plaid.secret}")
    private String secret;

    @Bean
    public PlaidApi plaidApi() {

        HashMap<String, String> headers = new HashMap<>();
        headers.put("clientId", clientId);
        headers.put("secret", secret);
        ApiClient apiClient = new ApiClient(headers);

        apiClient.setPlaidAdapter(ApiClient.Sandbox);

        return apiClient.createService(PlaidApi.class);
    }



}
