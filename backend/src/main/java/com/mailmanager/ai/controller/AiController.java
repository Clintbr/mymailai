package com.mailmanager.ai.controller;

import com.mailmanager.ai.model.EmailAnalysis;
import com.mailmanager.ai.model.ReplySuggestionRequest;
import com.mailmanager.ai.model.ReplySuggestionResponse;
import com.mailmanager.ai.service.AiService;
import com.mailmanager.common.dto.ApiResponse;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.service.MailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI API", description = "Endpoints for Google Gemini AI email analysis and reply draft generation")
public class AiController {

    private final AiService aiService;
    private final MailService mailService;

    @PostMapping("/analyze/{emailId}")
    @Operation(summary = "Analyze email by ID", description = "Use Google Gemini to extract category, priority, summary, and action items")
    public ResponseEntity<ApiResponse<EmailAnalysis>> analyzeEmailById(@PathVariable String emailId) {
        Email email = mailService.getEmailById(emailId);
        EmailAnalysis analysis = aiService.analyzeEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("Email analyzed successfully", analysis));
    }

    @PostMapping("/analyze")
    @Operation(summary = "Analyze custom email payload", description = "Run Gemini AI analysis on a raw email payload")
    public ResponseEntity<ApiResponse<EmailAnalysis>> analyzeEmailDirect(@RequestBody Email email) {
        EmailAnalysis analysis = aiService.analyzeEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("Email analyzed successfully", analysis));
    }

    @PostMapping("/reply/{emailId}")
    @Operation(summary = "Generate reply draft for email by ID", description = "Draft a contextual reply using Google Gemini. User review is required before sending.")
    public ResponseEntity<ApiResponse<ReplySuggestionResponse>> generateReplyForEmail(
            @PathVariable String emailId,
            @RequestBody(required = false) ReplySuggestionRequest request) {
        Email email = mailService.getEmailById(emailId);
        ReplySuggestionRequest effectiveRequest = request != null ? request : new ReplySuggestionRequest();
        effectiveRequest.setEmailId(emailId);
        ReplySuggestionResponse reply = aiService.generateReply(email, effectiveRequest);
        return ResponseEntity.ok(ApiResponse.ok("Reply draft generated successfully", reply));
    }

    @PostMapping("/reply")
    @Operation(summary = "Generate reply draft for payload", description = "Draft a contextual reply given an email payload and tone settings")
    public ResponseEntity<ApiResponse<ReplySuggestionResponse>> generateReplyDirect(
            @RequestParam String emailId,
            @RequestBody(required = false) ReplySuggestionRequest request) {
        Email email = mailService.getEmailById(emailId);
        ReplySuggestionResponse reply = aiService.generateReply(email, request);
        return ResponseEntity.ok(ApiResponse.ok("Reply draft generated successfully", reply));
    }

    @GetMapping("/status")
    @Operation(summary = "Get AI configuration status", description = "Check if Google Gemini is configured and view active model name")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiStatus() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "configured", aiService.isConfigured(),
                "model", aiService.getModelName(),
                "provider", "Google Gemini (Google AI Studio)"
        )));
    }
}
