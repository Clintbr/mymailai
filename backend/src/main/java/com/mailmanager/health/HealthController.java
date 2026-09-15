package com.mailmanager.health;

import com.mailmanager.ai.service.AiService;
import com.mailmanager.common.dto.ApiResponse;
import com.mailmanager.mail.service.MailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Health API", description = "System health check and component status")
public class HealthController {

    private final MailService mailService;
    private final AiService aiService;

    @GetMapping
    @Operation(summary = "System health check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> status = Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "mailProvider", mailService.getActiveProviderName(),
                "aiConfigured", aiService.isConfigured(),
                "aiModel", aiService.getModelName()
        );
        return ResponseEntity.ok(ApiResponse.ok("System is operational", status));
    }
}
