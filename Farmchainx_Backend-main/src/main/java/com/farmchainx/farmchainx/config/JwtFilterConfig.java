package com.farmchainx.farmchainx.config;

import com.farmchainx.farmchainx.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtFilterConfig {

    @Bean
    public JwtAuthFilter jwtAuthFilter(JwtUtil jwtUtil, AuthService authService) {
        return new JwtAuthFilter(jwtUtil, authService);
    }
}