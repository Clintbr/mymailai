package com.mailmanager.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                // REST API
                                "/api/**",
                                // OpenAPI / Swagger UI
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                // Static SPA assets (JS, CSS, images, fonts, etc.)
                                "/assets/**",
                                "/favicon.ico",
                                "/vite.svg",
                                "/*.js",
                                "/*.css",
                                "/*.map",
                                // SPA entry point (served by SpaForwardingController)
                                "/",
                                "/index.html",
                                // All SPA client-side routes forwarded to index.html
                                "/settings",
                                "/mail/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
