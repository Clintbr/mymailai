package com.mailmanager.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mailmanager.ai.model.EmailAnalysis;
import com.mailmanager.ai.model.EmailCategory;
import com.mailmanager.ai.model.EmailPriority;
import com.mailmanager.ai.model.ReplySuggestionRequest;
import com.mailmanager.ai.model.ReplySuggestionResponse;
import com.mailmanager.ai.model.ReplyTone;
import com.mailmanager.ai.model.SuggestedAction;
import com.mailmanager.config.GeminiProperties;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailRecipient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GeminiAiServiceTest {

    private GeminiAiService geminiAiService;
    private GeminiProperties geminiProperties;

    @BeforeEach
    void setUp() {
        geminiProperties = new GeminiProperties();
        geminiProperties.setModel("gemini-2.5-flash");
        geminiProperties.setApiKey(null); // test fallback mode without calling live API
        geminiAiService = new GeminiAiService(geminiProperties, new ObjectMapper());
    }

    @Test
    void isConfigured_ShouldReturnFalseWhenNoApiKey() {
        assertThat(geminiAiService.isConfigured()).isFalse();
    }

    @Test
    void getModelName_ShouldReturnConfiguredModel() {
        assertThat(geminiAiService.getModelName()).isEqualTo("gemini-2.5-flash");
    }

    @Test
    void analyzeEmail_ShouldCorrectlyClassifyJobOffer() {
        Email jobEmail = Email.builder()
                .id("1")
                .subject("Invitation to Technical Interview for Senior AI Engineer")
                .sender(EmailRecipient.of("Recruiter", "recruiter@tech.com"))
                .body("We would like to invite you for an interview next week.")
                .build();

        EmailAnalysis analysis = geminiAiService.analyzeEmail(jobEmail);

        assertThat(analysis).isNotNull();
        assertThat(analysis.getCategory()).isEqualTo(EmailCategory.JOB);
        assertThat(analysis.getPriority()).isEqualTo(EmailPriority.HIGH);
        assertThat(analysis.getSuggestedAction()).isEqualTo(SuggestedAction.REPLY);
        assertThat(analysis.isRequiresResponse()).isTrue();
    }

    @Test
    void analyzeEmail_ShouldCorrectlyClassifyUrgentIssue() {
        Email urgentEmail = Email.builder()
                .id("2")
                .subject("URGENT: Production Server Outage")
                .sender(EmailRecipient.of("Ops", "ops@tech.com"))
                .body("Critical error in production payment webhook.")
                .build();

        EmailAnalysis analysis = geminiAiService.analyzeEmail(urgentEmail);

        assertThat(analysis).isNotNull();
        assertThat(analysis.getPriority()).isEqualTo(EmailPriority.URGENT);
        assertThat(analysis.getCategory()).isEqualTo(EmailCategory.WORK);
    }

    @Test
    void generateReply_ShouldGenerateContextualDraft() {
        Email email = Email.builder()
                .id("1")
                .subject("Interview Slot Confirmation")
                .sender(EmailRecipient.of("Sarah Jenkins", "sarah@innovate.io"))
                .body("Could you confirm your availability for Thursday?")
                .build();

        ReplySuggestionRequest request = ReplySuggestionRequest.builder()
                .tone(ReplyTone.PROFESSIONAL)
                .customInstructions("Available on Thursday 2 PM")
                .build();

        ReplySuggestionResponse response = geminiAiService.generateReply(email, request);

        assertThat(response).isNotNull();
        assertThat(response.getSuggestedReply()).isNotBlank();
        assertThat(response.getSuggestedReply()).contains("Sarah");
        assertThat(response.getTone()).isEqualTo(ReplyTone.PROFESSIONAL);
    }
}
