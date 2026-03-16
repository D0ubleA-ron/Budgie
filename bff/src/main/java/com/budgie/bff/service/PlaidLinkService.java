package com.budgie.bff.service;

import com.plaid.client.model.*;
import com.plaid.client.request.PlaidApi;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class PlaidLinkService {

    private final PlaidApi plaidApi;

    public PlaidLinkService(PlaidApi plaidApi) {
        this.plaidApi = plaidApi;
    }

    public String createLinkToken(String userId) throws IOException {
        LinkTokenCreateRequestUser user = new LinkTokenCreateRequestUser().clientUserId(userId);

        LinkTokenCreateRequest request = new LinkTokenCreateRequest()
                .user(user)
                .clientName("Budgie")
                .language("en")
                .countryCodes(List.of(CountryCode.CA))
                .products(List.of(Products.TRANSACTIONS));

        LinkTokenCreateResponse response = plaidApi
                .linkTokenCreate(request)
                .execute()
                .body();

        if (response == null || response.getLinkToken() == null) {
            throw new RuntimeException("Failed to create link token");
        }

        System.out.println(response);

        return response.getLinkToken();
    }


}
