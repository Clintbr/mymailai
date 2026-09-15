package com.mailmanager.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "mail")
public class MailProperties {

    /**
     * Active provider type: MOCK or GMAIL.
     */
    private String providerType = "MOCK";

    private GoogleOAuthProperties google = new GoogleOAuthProperties();

    @Getter
    @Setter
    public static class GoogleOAuthProperties {
        private String clientId;
        private String clientSecret;
        private String redirectUri = "http://localhost:8080/api/auth/oauth2/callback/google";
        private String applicationName = "AI Mail Manager";

        public boolean isConfigured() {
            return clientId != null && !clientId.trim().isEmpty() && !clientId.contains("your_google_client_id")
                    && clientSecret != null && !clientSecret.trim().isEmpty() && !clientSecret.contains("your_google_client_secret");
        }
    }
}
