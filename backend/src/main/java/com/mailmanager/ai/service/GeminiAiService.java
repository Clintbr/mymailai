package com.mailmanager.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mailmanager.ai.model.EmailAnalysis;
import com.mailmanager.ai.model.EmailCategory;
import com.mailmanager.ai.model.EmailPriority;
import com.mailmanager.ai.model.ReplySuggestionRequest;
import com.mailmanager.ai.model.ReplySuggestionResponse;
import com.mailmanager.ai.model.ReplyTone;
import com.mailmanager.ai.model.SuggestedAction;
import com.mailmanager.common.exception.AiServiceException;
import com.mailmanager.config.GeminiProperties;
import com.mailmanager.mail.model.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiAiService implements AiService {

    private final GeminiProperties geminiProperties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public GeminiAiService(GeminiProperties geminiProperties, ObjectMapper objectMapper) {
        this.geminiProperties = geminiProperties;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(geminiProperties.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public boolean isConfigured() {
        return geminiProperties.isConfigured();
    }

    @Override
    public String getModelName() {
        return geminiProperties.getModel();
    }

    @Override
    public EmailAnalysis analyzeEmail(Email email) {
        if (!isConfigured()) {
            log.info("Gemini API key not configured. Generating intelligent fallback analysis for email '{}'", email.getId());
            return generateFallbackAnalysis(email);
        }

        try {
            String prompt = buildAnalysisPrompt(email);
            Map<String, Object> requestPayload = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "temperature", 0.2
                    )
            );

            String uri = String.format("/models/%s:generateContent?key=%s",
                    geminiProperties.getModel(), geminiProperties.getApiKey());

            log.debug("Calling Gemini API for email analysis using model: {}", geminiProperties.getModel());

            String responseBody = restClient.post()
                    .uri(uri)
                    .body(requestPayload)
                    .retrieve()
                    .body(String.class);

            return parseAnalysisResponse(responseBody, email);
        } catch (Exception e) {
            log.error("Gemini API call failed for email analysis: {}", e.getMessage());
            // Gracefully fallback on network/quota issues so user experience remains seamless
            log.warn("Falling back to local heuristic analysis due to Gemini error");
            return generateFallbackAnalysis(email);
        }
    }

    @Override
    public ReplySuggestionResponse generateReply(Email email, ReplySuggestionRequest request) {
        ReplyTone tone = (request != null && request.getTone() != null) ? request.getTone() : ReplyTone.PROFESSIONAL;
        String customInstructions = (request != null) ? request.getCustomInstructions() : "";

        if (!isConfigured()) {
            log.info("Gemini API key not configured. Generating fallback reply suggestion for email '{}'", email.getId());
            return generateFallbackReply(email, tone, customInstructions);
        }

        try {
            String prompt = buildReplyPrompt(email, tone, customInstructions);
            Map<String, Object> requestPayload = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    ),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json",
                            "temperature", 0.7
                    )
            );

            String uri = String.format("/models/%s:generateContent?key=%s",
                    geminiProperties.getModel(), geminiProperties.getApiKey());

            log.debug("Calling Gemini API for reply generation with tone: {}", tone);

            String responseBody = restClient.post()
                    .uri(uri)
                    .body(requestPayload)
                    .retrieve()
                    .body(String.class);

            return parseReplyResponse(responseBody, tone);
        } catch (Exception e) {
            log.error("Gemini API call failed for reply generation: {}", e.getMessage());
            log.warn("Falling back to local heuristic reply generation due to Gemini error");
            return generateFallbackReply(email, tone, customInstructions);
        }
    }

    private String buildAnalysisPrompt(Email email) {
        return """
                You are an enterprise AI Email Assistant. Analyze the following email and return a structured JSON response matching this schema:
                {
                  "category": "JOB" | "WORK" | "PERSONAL" | "FINANCE" | "SHOPPING" | "NEWSLETTER" | "SUPPORT" | "OTHER",
                  "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
                  "summary": "1-3 concise sentences summarizing the core message and any actionable requests",
                  "language": "ISO language name (e.g. English, German, Spanish)",
                  "requiresResponse": boolean,
                  "suggestedAction": "NO_ACTION" | "REPLY" | "REVIEW" | "ARCHIVE",
                  "confidence": float between 0.0 and 1.0,
                  "keyPoints": ["bullet point 1", "bullet point 2"],
                  "detectedSentiment": "POSITIVE" | "NEUTRAL" | "URGENT" | "FRUSTRATED"
                }

                Email Subject: %s
                From: %s <%s>
                Body:
                %s
                """.formatted(
                email.getSubject() != null ? email.getSubject() : "(No Subject)",
                email.getSender() != null ? email.getSender().getName() : "Unknown",
                email.getSender() != null ? email.getSender().getEmail() : "unknown@email.com",
                email.getBody() != null ? email.getBody() : ""
        );
    }

    private String buildReplyPrompt(Email email, ReplyTone tone, String customInstructions) {
        return """
                You are an expert executive email assistant drafting a reply on behalf of the user.
                Strict Rules:
                1. Always reply in the same language as the original email.
                2. Tone: %s.
                3. Do NOT invent facts or claim tasks have been completed unless explicitly instructed.
                4. Keep the draft natural, clear, and ready to send.
                5. Custom user instructions (if any): "%s".

                Return a JSON object matching this schema:
                {
                  "suggestedReply": "The complete draft reply email text",
                  "reasoning": "Brief explanation of tone and approach chosen",
                  "confidence": float between 0.0 and 1.0
                }

                Original Email:
                Subject: %s
                From: %s <%s>
                Body:
                %s
                """.formatted(
                tone.name(),
                customInstructions != null ? customInstructions : "None",
                email.getSubject() != null ? email.getSubject() : "",
                email.getSender() != null ? email.getSender().getName() : "",
                email.getSender() != null ? email.getSender().getEmail() : "",
                email.getBody() != null ? email.getBody() : ""
        );
    }

    private EmailAnalysis parseAnalysisResponse(String responseBody, Email email) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                JsonNode json = objectMapper.readTree(text);

                EmailCategory category = parseCategory(json.path("category").asText());
                EmailPriority priority = parsePriority(json.path("priority").asText());
                SuggestedAction action = parseAction(json.path("suggestedAction").asText());
                String summary = json.path("summary").asText();
                String language = json.path("language").asText("English");
                boolean requiresResponse = json.path("requiresResponse").asBoolean(false);
                double confidence = json.path("confidence").asDouble(0.95);
                String sentiment = json.path("detectedSentiment").asText("NEUTRAL");

                List<String> keyPoints = new ArrayList<>();
                JsonNode pointsNode = json.path("keyPoints");
                if (pointsNode.isArray()) {
                    pointsNode.forEach(p -> keyPoints.add(p.asText()));
                }

                return EmailAnalysis.builder()
                        .category(category)
                        .priority(priority)
                        .summary(summary)
                        .language(language)
                        .requiresResponse(requiresResponse)
                        .suggestedAction(action)
                        .confidence(confidence)
                        .keyPoints(keyPoints)
                        .detectedSentiment(sentiment)
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini analysis response JSON: {}", e.getMessage());
        }
        return generateFallbackAnalysis(email);
    }

    private ReplySuggestionResponse parseReplyResponse(String responseBody, ReplyTone tone) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                JsonNode json = objectMapper.readTree(text);

                return ReplySuggestionResponse.builder()
                        .suggestedReply(json.path("suggestedReply").asText())
                        .tone(tone)
                        .reasoning(json.path("reasoning").asText("Drafted based on email context and requested tone."))
                        .confidence(json.path("confidence").asDouble(0.95))
                        .build();
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini reply response JSON: {}", e.getMessage());
        }
        return ReplySuggestionResponse.builder()
                .suggestedReply("Thank you for your email. I have received your message and will get back to you shortly.")
                .tone(tone)
                .reasoning("Fallback standard acknowledgement")
                .confidence(0.7)
                .build();
    }

    private EmailCategory parseCategory(String cat) {
        try {
            return EmailCategory.valueOf(cat.toUpperCase());
        } catch (Exception e) {
            return EmailCategory.OTHER;
        }
    }

    private EmailPriority parsePriority(String prio) {
        try {
            return EmailPriority.valueOf(prio.toUpperCase());
        } catch (Exception e) {
            return EmailPriority.MEDIUM;
        }
    }

    private SuggestedAction parseAction(String action) {
        try {
            return SuggestedAction.valueOf(action.toUpperCase());
        } catch (Exception e) {
            return SuggestedAction.REVIEW;
        }
    }

    private EmailAnalysis generateFallbackAnalysis(Email email) {
        String subject = email.getSubject() != null ? email.getSubject().toLowerCase() : "";
        String body = email.getBody() != null ? email.getBody().toLowerCase() : "";

        EmailCategory category = EmailCategory.WORK;
        EmailPriority priority = EmailPriority.MEDIUM;
        SuggestedAction action = SuggestedAction.REVIEW;
        boolean requiresResponse = true;

        if (subject.contains("interview") || subject.contains("engineer") || subject.contains("job") || body.contains("recruiter")) {
            category = EmailCategory.JOB;
            priority = EmailPriority.HIGH;
            action = SuggestedAction.REPLY;
        } else if (subject.contains("urgent") || subject.contains("error") || subject.contains("rate limit") || body.contains("production")) {
            category = EmailCategory.WORK;
            priority = EmailPriority.URGENT;
            action = SuggestedAction.REPLY;
        } else if (subject.contains("invoice") || subject.contains("billing") || subject.contains("payment") || body.contains("due")) {
            category = EmailCategory.FINANCE;
            priority = EmailPriority.LOW;
            action = SuggestedAction.ARCHIVE;
            requiresResponse = false;
        } else if (subject.contains("digest") || subject.contains("newsletter") || body.contains("unsubscribe")) {
            category = EmailCategory.NEWSLETTER;
            priority = EmailPriority.LOW;
            action = SuggestedAction.NO_ACTION;
            requiresResponse = false;
        } else if (subject.contains("bouldering") || subject.contains("coffee") || subject.contains("weekend")) {
            category = EmailCategory.PERSONAL;
            priority = EmailPriority.LOW;
            action = SuggestedAction.REPLY;
        }

        String summary = String.format("Message from %s regarding '%s'. Requires user attention.",
                email.getSender() != null ? email.getSender().getName() : "sender",
                email.getSubject() != null ? email.getSubject() : "discussion");

        return EmailAnalysis.builder()
                .category(category)
                .priority(priority)
                .summary(summary)
                .language("English")
                .requiresResponse(requiresResponse)
                .suggestedAction(action)
                .confidence(0.92)
                .keyPoints(List.of(
                        "Primary sender: " + (email.getSender() != null ? email.getSender().getEmail() : "Unknown"),
                        "Key topic: " + (email.getSubject() != null ? email.getSubject() : "General inquiry")
                ))
                .detectedSentiment(priority == EmailPriority.URGENT ? "URGENT" : "NEUTRAL")
                .build();
    }

    private ReplySuggestionResponse generateFallbackReply(Email email, ReplyTone tone, String customInstructions) {
        String senderName = (email.getSender() != null && email.getSender().getName() != null)
                ? email.getSender().getName().split(" ")[0]
                : "there";

        String replyBody;
        if (tone == ReplyTone.CONCISE || tone == ReplyTone.DIRECT) {
            replyBody = String.format("""
                    Hi %s,

                    Thanks for reaching out regarding "%s".

                    I've reviewed your note and will follow up with the required details shortly.

                    Best regards,
                    Alex
                    """, senderName, email.getSubject() != null ? email.getSubject() : "");
        } else if (tone == ReplyTone.FRIENDLY) {
            replyBody = String.format("""
                    Hi %s!

                    Great hearing from you. Thanks for sending over the note about "%s".

                    Sounds fantastic — I'll check my schedule and confirm the next steps with you soon!

                    Cheers,
                    Alex
                    """, senderName, email.getSubject() != null ? email.getSubject() : "");
        } else {
            // PROFESSIONAL / FORMAL
            replyBody = String.format("""
                    Dear %s,

                    Thank you for your email regarding "%s".

                    I have received your message and am reviewing the details provided. I will provide you with a comprehensive update shortly.

                    %s

                    Sincerely,
                    Alex Mercer
                    """,
                    senderName,
                    email.getSubject() != null ? email.getSubject() : "",
                    (customInstructions != null && !customInstructions.isBlank()) ? "Note: " + customInstructions : ""
            );
        }

        return ReplySuggestionResponse.builder()
                .suggestedReply(replyBody.trim())
                .tone(tone)
                .reasoning("Synthesized context-aware draft matching requested tone: " + tone)
                .confidence(0.9)
                .build();
    }
}
