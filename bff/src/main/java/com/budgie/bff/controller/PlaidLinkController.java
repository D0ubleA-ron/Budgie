package com.budgie.bff.controller;

import com.budgie.bff.models.AccessTokenDto;
import com.budgie.bff.models.LinkDto;
import com.budgie.bff.service.PlaidLinkService;

import com.plaid.client.model.ItemPublicTokenCreateResponse;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.LinkTokenCreateResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/plaid")
@CrossOrigin(origins = "http://localhost:4200")
public class PlaidLinkController {
    private final PlaidLinkService plaidLinkService;

    public PlaidLinkController(PlaidLinkService plaidLinkService) {
        this.plaidLinkService = plaidLinkService;
    }

    @PostMapping("/link-token")
    public LinkDto createLinkToken(@RequestParam String userId) throws IOException {
        LinkTokenCreateResponse response = plaidLinkService.createLinkToken(userId);
        return new LinkDto()
                .setToken(response.getLinkToken());
    }

    @PostMapping("/exchange-token")
    public AccessTokenDto exchangeToken(@RequestParam String token) throws IOException {
        ItemPublicTokenExchangeResponse response = plaidLinkService.exchangeLinkToken(token);
        return new AccessTokenDto()
                .setAccessToken(response.getAccessToken())
                .setItemId(response.getItemId())
                .setRequestId(response.getRequestId());
    }
}
