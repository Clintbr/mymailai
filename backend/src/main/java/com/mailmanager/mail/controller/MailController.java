package com.mailmanager.mail.controller;

import com.mailmanager.common.dto.ApiResponse;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailMessage;
import com.mailmanager.mail.service.MailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
@Tag(name = "Mail API", description = "Endpoints for fetching, reading, archiving, and sending emails")
public class MailController {

    private final MailService mailService;

    @GetMapping
    @Operation(summary = "List emails", description = "Retrieve emails from the active mail provider with optional search query")
    public ResponseEntity<ApiResponse<List<Email>>> getEmails(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "50") int limit) {
        List<Email> emails = (q != null && !q.trim().isEmpty())
                ? mailService.searchEmails(q, limit)
                : mailService.getEmails();
        return ResponseEntity.ok(ApiResponse.ok(emails));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get email by ID", description = "Fetch a single email by its unique ID")
    public ResponseEntity<ApiResponse<Email>> getEmailById(@PathVariable String id) {
        Email email = mailService.getEmailById(id);
        return ResponseEntity.ok(ApiResponse.ok(email));
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "Mark email as read")
    public ResponseEntity<ApiResponse<Map<String, String>>> markAsRead(@PathVariable String id) {
        mailService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Email marked as read", Map.of("id", id, "read", "true")));
    }

    @PostMapping("/{id}/unread")
    @Operation(summary = "Mark email as unread")
    public ResponseEntity<ApiResponse<Map<String, String>>> markAsUnread(@PathVariable String id) {
        mailService.markAsUnread(id);
        return ResponseEntity.ok(ApiResponse.ok("Email marked as unread", Map.of("id", id, "read", "false")));
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "Archive email")
    public ResponseEntity<ApiResponse<Map<String, String>>> archiveEmail(@PathVariable String id) {
        mailService.archiveEmail(id);
        return ResponseEntity.ok(ApiResponse.ok("Email archived successfully", Map.of("id", id, "archived", "true")));
    }

    @PostMapping("/send")
    @Operation(summary = "Send an email message (Human-in-the-loop action)")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendEmail(@Valid @RequestBody EmailMessage message) {
        mailService.sendEmail(message);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Email sent successfully", Map.of("status", "SENT")));
    }

    @GetMapping("/provider")
    @Operation(summary = "Get active mail provider information")
    public ResponseEntity<ApiResponse<Map<String, String>>> getProviderInfo() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "activeProvider", mailService.getActiveProviderName(),
                "available", String.valueOf(mailService.getActiveProvider().isAvailable())
        )));
    }
}
