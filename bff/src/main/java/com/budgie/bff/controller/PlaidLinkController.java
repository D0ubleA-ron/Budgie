package com.budgie.bff.controller;

import com.budgie.bff.service.PlaidLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/plaid")
public class PlaidLinkController {
    private final PlaidLinkService plaidLinkService;

    public PlaidLinkController(PlaidLinkService plaidLinkService) {
        this.plaidLinkService = plaidLinkService;
    }

    @PostMapping("/link-token")
    public ResponseEntity<?> createLinkToken(String userId) {
        try {
            String linkToken = plaidLinkService.createLinkToken("1c6e587b-8ce1-4837-b16c-3263f0041e13");
            return ResponseEntity.ok(Map.of("linkToken", linkToken));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to create link token"));
        }
    }
}
