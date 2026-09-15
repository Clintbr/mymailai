package com.mailmanager.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "gemini")
public class GeminiProperties {

    /**
     * Google Gemini API Key. Must not be hardcoded or logged.
     */
    private String apiKey;

    /**
     * Gemini Model ID (e.g., gemini-2.5-flash, gemini-1.5-flash, gemini-1.5-pro).
     */
    private String model = "gemini-2.5-flash";

    /**
     * Gemini API Base URL.
     */
    private String baseUrl = "https://generativelanguage.googleapis.com/v1beta";

    /**
     * Timeout for Gemini API requests in seconds.
     */
    private int timeoutSeconds = 30;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.contains("your_gemini_api_key");
    }
}
