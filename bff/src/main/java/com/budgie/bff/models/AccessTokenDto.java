package com.budgie.bff.models;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
public class AccessTokenDto {
    private String accessToken;
    private String itemId;
    private String requestId;
}
