package com.mailmanager.mail.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailMessage;
import com.mailmanager.mail.model.EmailRecipient;
import com.mailmanager.mail.provider.MailProvider;
import com.mailmanager.mail.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MailService mailService;

    @Test
    void getEmails_ShouldReturnEmailList() throws Exception {
        Email email = Email.builder().id("msg-1").subject("Test Subject").build();
        when(mailService.getEmails()).thenReturn(List.of(email));

        mockMvc.perform(get("/api/mail"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("msg-1"))
                .andExpect(jsonPath("$.data[0].subject").value("Test Subject"));
    }

    @Test
    void getEmailById_ShouldReturnEmail() throws Exception {
        Email email = Email.builder().id("msg-100").subject("Detailed Subject").build();
        when(mailService.getEmailById("msg-100")).thenReturn(email);

        mockMvc.perform(get("/api/mail/msg-100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("msg-100"));
    }

    @Test
    void sendEmail_ShouldReturnCreated() throws Exception {
        EmailMessage message = EmailMessage.builder()
                .to(List.of(EmailRecipient.of("recipient@example.com")))
                .subject("Test sending")
                .body("Hello, this is a test.")
                .build();

        mockMvc.perform(post("/api/mail/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(message)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("SENT"));

        verify(mailService, times(1)).sendEmail(any(EmailMessage.class));
    }
}
