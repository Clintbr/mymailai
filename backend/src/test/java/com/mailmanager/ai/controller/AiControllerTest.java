package com.mailmanager.ai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mailmanager.ai.model.EmailAnalysis;
import com.mailmanager.ai.model.EmailCategory;
import com.mailmanager.ai.model.EmailPriority;
import com.mailmanager.ai.model.ReplySuggestionRequest;
import com.mailmanager.ai.model.ReplySuggestionResponse;
import com.mailmanager.ai.model.ReplyTone;
import com.mailmanager.ai.model.SuggestedAction;
import com.mailmanager.ai.service.AiService;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiService aiService;

    @MockBean
    private MailService mailService;

    @Test
    void analyzeEmailById_ShouldReturnEmailAnalysis() throws Exception {
        Email email = Email.builder().id("msg-1").subject("Urgent meeting").build();
        EmailAnalysis analysis = EmailAnalysis.builder()
                .category(EmailCategory.WORK)
                .priority(EmailPriority.HIGH)
                .summary("Meeting requested for project status.")
                .requiresResponse(true)
                .suggestedAction(SuggestedAction.REPLY)
                .confidence(0.95)
                .build();

        when(mailService.getEmailById("msg-1")).thenReturn(email);
        when(aiService.analyzeEmail(email)).thenReturn(analysis);

        mockMvc.perform(post("/api/ai/analyze/msg-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.category").value("WORK"))
                .andExpect(jsonPath("$.data.priority").value("HIGH"))
                .andExpect(jsonPath("$.data.suggestedAction").value("REPLY"));
    }

    @Test
    void generateReplyForEmail_ShouldReturnDraftReply() throws Exception {
        Email email = Email.builder().id("msg-1").subject("Urgent meeting").build();
        ReplySuggestionResponse reply = ReplySuggestionResponse.builder()
                .suggestedReply("Thank you for reaching out. I am available tomorrow.")
                .tone(ReplyTone.PROFESSIONAL)
                .confidence(0.92)
                .build();

        when(mailService.getEmailById("msg-1")).thenReturn(email);
        when(aiService.generateReply(any(Email.class), any(ReplySuggestionRequest.class))).thenReturn(reply);

        ReplySuggestionRequest request = ReplySuggestionRequest.builder()
                .tone(ReplyTone.PROFESSIONAL)
                .build();

        mockMvc.perform(post("/api/ai/reply/msg-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.suggestedReply").value("Thank you for reaching out. I am available tomorrow."));
    }

    @Test
    void getAiStatus_ShouldReturnConfigurationStatus() throws Exception {
        when(aiService.isConfigured()).thenReturn(true);
        when(aiService.getModelName()).thenReturn("gemini-2.5-flash");

        mockMvc.perform(get("/api/ai/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.configured").value(true))
                .andExpect(jsonPath("$.data.model").value("gemini-2.5-flash"));
    }
}
