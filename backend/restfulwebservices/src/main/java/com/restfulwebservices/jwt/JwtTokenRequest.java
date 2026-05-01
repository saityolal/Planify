package com.restfulwebservices.jwt;

import jakarta.validation.constraints.NotBlank;

public record JwtTokenRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") String password) {}


