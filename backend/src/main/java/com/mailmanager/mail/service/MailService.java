package com.mailmanager.mail.service;

import com.mailmanager.config.MailProperties;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailMessage;
import com.mailmanager.mail.provider.GmailProvider;
import com.mailmanager.mail.provider.MailProvider;
import com.mailmanager.mail.provider.MockMailProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class MailService {

    private final MailProperties mailProperties;
    private final MockMailProvider mockMailProvider;
    private final GmailProvider gmailProvider;

    public MailService(MailProperties mailProperties, MockMailProvider mockMailProvider, GmailProvider gmailProvider) {
        this.mailProperties = mailProperties;
        this.mockMailProvider = mockMailProvider;
        this.gmailProvider = gmailProvider;
    }

    public MailProvider getActiveProvider() {
        String configuredType = mailProperties.getProviderType();
        if ("GMAIL".equalsIgnoreCase(configuredType) && gmailProvider.isAvailable()) {
            return gmailProvider;
        }
        return mockMailProvider;
    }

    public List<Email> getEmails() {
        return getActiveProvider().getEmails();
    }

    public List<Email> searchEmails(String query, int maxResults) {
        return getActiveProvider().getEmails(query, maxResults);
    }

    public Email getEmailById(String id) {
        return getActiveProvider().getEmail(id);
    }

    public void sendEmail(EmailMessage message) {
        log.info("Sending email via provider [{}]: subject='{}'", getActiveProvider().getProviderName(), message.getSubject());
        getActiveProvider().sendEmail(message);
    }

    public void markAsRead(String id) {
        getActiveProvider().markAsRead(id);
    }

    public void markAsUnread(String id) {
        getActiveProvider().markAsUnread(id);
    }

    public void archiveEmail(String id) {
        getActiveProvider().archive(id);
    }

    public String getActiveProviderName() {
        return getActiveProvider().getProviderName();
    }
}
