package com.budgie.bff.controller;

import com.budgie.bff.models.LinkDto;
import com.budgie.bff.service.PlaidLinkService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/plaid")
public class PlaidLinkController {
    private final PlaidLinkService plaidLinkService;

    public PlaidLinkController(PlaidLinkService plaidLinkService) {
        this.plaidLinkService = plaidLinkService;
    }

    @PostMapping("/link-token")
    public LinkDto createLinkToken(String userId) throws IOException {
        return new LinkDto()
                .setToken(plaidLinkService.createLinkToken(userId));
    }
}
