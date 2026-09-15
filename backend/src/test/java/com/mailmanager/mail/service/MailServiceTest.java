package com.mailmanager.mail.service;

import com.mailmanager.config.MailProperties;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailMessage;
import com.mailmanager.mail.model.EmailRecipient;
import com.mailmanager.mail.provider.GmailProvider;
import com.mailmanager.mail.provider.MockMailProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MailServiceTest {

    @Mock
    private MockMailProvider mockMailProvider;

    @Mock
    private GmailProvider gmailProvider;

    private MailProperties mailProperties;
    private MailService mailService;

    @BeforeEach
    void setUp() {
        mailProperties = new MailProperties();
        mailProperties.setProviderType("MOCK");
        mailService = new MailService(mailProperties, mockMailProvider, gmailProvider);
    }

    @Test
    void getEmails_ShouldReturnEmailsFromActiveProvider() {
        Email email = Email.builder().id("1").subject("Test").build();
        when(mockMailProvider.getEmails()).thenReturn(List.of(email));

        List<Email> result = mailService.getEmails();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo("1");
        verify(mockMailProvider, times(1)).getEmails();
    }

    @Test
    void getEmailById_ShouldReturnEmail() {
        Email email = Email.builder().id("msg-123").subject("Hello").build();
        when(mockMailProvider.getEmail("msg-123")).thenReturn(email);

        Email result = mailService.getEmailById("msg-123");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("msg-123");
        verify(mockMailProvider).getEmail("msg-123");
    }

    @Test
    void sendEmail_ShouldDelegateToProvider() {
        EmailMessage message = EmailMessage.builder()
                .to(List.of(EmailRecipient.of("target@example.com")))
                .subject("Test Subject")
                .body("Test Body")
                .build();

        mailService.sendEmail(message);

        verify(mockMailProvider).sendEmail(message);
    }

    @Test
    void markAsRead_ShouldDelegateToProvider() {
        mailService.markAsRead("msg-1");
        verify(mockMailProvider).markAsRead("msg-1");
    }

    @Test
    void archiveEmail_ShouldDelegateToProvider() {
        mailService.archiveEmail("msg-1");
        verify(mockMailProvider).archive("msg-1");
    }
}
