package com.mailmanager.mail.provider;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;
import com.google.api.services.gmail.model.MessagePartHeader;
import com.google.api.services.gmail.model.ModifyMessageRequest;
import com.mailmanager.common.exception.MailProviderException;
import com.mailmanager.common.exception.ResourceNotFoundException;
import com.mailmanager.config.MailProperties;
import com.mailmanager.mail.model.Email;
import com.mailmanager.mail.model.EmailFolder;
import com.mailmanager.mail.model.EmailMessage;
import com.mailmanager.mail.model.EmailRecipient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component("gmailProvider")
public class GmailProvider implements MailProvider {

    private final MailProperties mailProperties;
    private Gmail gmailService;

    public GmailProvider(MailProperties mailProperties) {
        this.mailProperties = mailProperties;
        initGmailClientIfConfigured();
    }

    private void initGmailClientIfConfigured() {
        if (mailProperties.getGoogle().isConfigured()) {
            try {
                NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
                GsonFactory jsonFactory = GsonFactory.getDefaultInstance();
                // Client will be initialized with authorized credential when user completes OAuth flow
                log.info("Gmail provider configured with Client ID: {}...", 
                        mailProperties.getGoogle().getClientId().substring(0, Math.min(8, mailProperties.getGoogle().getClientId().length())));
            } catch (GeneralSecurityException | IOException e) {
                log.error("Failed to initialize Gmail HTTP Transport: {}", e.getMessage());
            }
        } else {
            log.info("Gmail credentials not yet configured in environment. GmailProvider is in standby mode.");
        }
    }

    public void setAuthorizedGmailService(Gmail service) {
        this.gmailService = service;
    }

    @Override
    public List<Email> getEmails() {
        return getEmails("in:inbox", 50);
    }

    @Override
    public List<Email> getEmails(String query, int maxResults) {
        if (!isAvailable()) {
            log.warn("GmailProvider is not yet authenticated with user credentials.");
            throw new MailProviderException("Gmail is not authenticated. Please connect your Google account or switch to MOCK provider.");
        }

        try {
            ListMessagesResponse response = gmailService.users().messages().list("me")
                    .setQ(query)
                    .setMaxResults((long) maxResults)
                    .execute();

            List<Message> messages = response.getMessages();
            if (messages == null || messages.isEmpty()) {
                return Collections.emptyList();
            }

            List<Email> emails = new ArrayList<>();
            for (Message msgSummary : messages) {
                try {
                    Message fullMsg = gmailService.users().messages().get("me", msgSummary.getId())
                            .setFormat("full")
                            .execute();
                    emails.add(mapGmailMessageToEmail(fullMsg));
                } catch (IOException e) {
                    log.warn("Failed to fetch Gmail message details for id {}: {}", msgSummary.getId(), e.getMessage());
                }
            }
            return emails;
        } catch (IOException e) {
            log.error("Failed to list Gmail messages: {}", e.getMessage());
            throw new MailProviderException("Failed to fetch emails from Gmail: " + e.getMessage(), e);
        }
    }

    @Override
    public Email getEmail(String id) {
        if (!isAvailable()) {
            throw new MailProviderException("Gmail is not authenticated. Please connect your Google account.");
        }

        try {
            Message message = gmailService.users().messages().get("me", id)
                    .setFormat("full")
                    .execute();
            if (message == null) {
                throw new ResourceNotFoundException("Email", "id", id);
            }
            return mapGmailMessageToEmail(message);
        } catch (IOException e) {
            log.error("Failed to get Gmail message {}: {}", id, e.getMessage());
            throw new MailProviderException("Failed to retrieve email from Gmail: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendEmail(EmailMessage message) {
        if (!isAvailable()) {
            throw new MailProviderException("Gmail is not authenticated. Cannot send email.");
        }

        try {
            // Build RFC 822 Mime message
            StringBuilder rawBuilder = new StringBuilder();
            if (!message.getTo().isEmpty()) {
                rawBuilder.append("To: ").append(message.getTo().get(0).getEmail()).append("\r\n");
            }
            if (message.getSubject() != null) {
                rawBuilder.append("Subject: =?utf-8?B?")
                        .append(Base64.getEncoder().encodeToString(message.getSubject().getBytes(StandardCharsets.UTF_8)))
                        .append("?=\r\n");
            }
            if (message.getInReplyTo() != null) {
                rawBuilder.append("In-Reply-To: ").append(message.getInReplyTo()).append("\r\n");
                rawBuilder.append("References: ").append(message.getInReplyTo()).append("\r\n");
            }
            rawBuilder.append("Content-Type: text/plain; charset=UTF-8\r\n\r\n");
            rawBuilder.append(message.getBody());

            String encodedEmail = Base64.getUrlEncoder().encodeToString(rawBuilder.toString().getBytes(StandardCharsets.UTF_8));
            Message msg = new Message();
            msg.setRaw(encodedEmail);
            if (message.getThreadId() != null) {
                msg.setThreadId(message.getThreadId());
            }

            gmailService.users().messages().send("me", msg).execute();
            log.info("Successfully sent email via Gmail API with subject: {}", message.getSubject());
        } catch (IOException e) {
            log.error("Failed to send email via Gmail API: {}", e.getMessage());
            throw new MailProviderException("Failed to send email via Gmail API: " + e.getMessage(), e);
        }
    }

    @Override
    public void markAsRead(String id) {
        if (!isAvailable()) {
            throw new MailProviderException("Gmail is not authenticated.");
        }
        try {
            ModifyMessageRequest mods = new ModifyMessageRequest().setRemoveLabelIds(List.of("UNREAD"));
            gmailService.users().messages().modify("me", id, mods).execute();
        } catch (IOException e) {
            log.error("Failed to mark Gmail message {} as read: {}", id, e.getMessage());
            throw new MailProviderException("Failed to mark email as read: " + e.getMessage(), e);
        }
    }

    @Override
    public void markAsUnread(String id) {
        if (!isAvailable()) {
            throw new MailProviderException("Gmail is not authenticated.");
        }
        try {
            ModifyMessageRequest mods = new ModifyMessageRequest().setAddLabelIds(List.of("UNREAD"));
            gmailService.users().messages().modify("me", id, mods).execute();
        } catch (IOException e) {
            log.error("Failed to mark Gmail message {} as unread: {}", id, e.getMessage());
            throw new MailProviderException("Failed to mark email as unread: " + e.getMessage(), e);
        }
    }

    @Override
    public void archive(String id) {
        if (!isAvailable()) {
            throw new MailProviderException("Gmail is not authenticated.");
        }
        try {
            ModifyMessageRequest mods = new ModifyMessageRequest().setRemoveLabelIds(List.of("INBOX"));
            gmailService.users().messages().modify("me", id, mods).execute();
        } catch (IOException e) {
            log.error("Failed to archive Gmail message {}: {}", id, e.getMessage());
            throw new MailProviderException("Failed to archive email: " + e.getMessage(), e);
        }
    }

    @Override
    public String getProviderName() {
        return "GMAIL (Official Google API)";
    }

    @Override
    public boolean isAvailable() {
        return gmailService != null;
    }

    private Email mapGmailMessageToEmail(Message msg) {
        List<String> labelIds = msg.getLabelIds() != null ? msg.getLabelIds() : Collections.emptyList();
        boolean isRead = !labelIds.contains("UNREAD");
        boolean isStarred = labelIds.contains("STARRED");

        String subject = "";
        EmailRecipient sender = null;
        List<EmailRecipient> recipients = new ArrayList<>();
        Instant timestamp = msg.getInternalDate() != null ? Instant.ofEpochMilli(msg.getInternalDate()) : Instant.now();

        if (msg.getPayload() != null && msg.getPayload().getHeaders() != null) {
            for (MessagePartHeader header : msg.getPayload().getHeaders()) {
                if ("Subject".equalsIgnoreCase(header.getName())) {
                    subject = header.getValue();
                } else if ("From".equalsIgnoreCase(header.getName())) {
                    sender = parseRecipientHeader(header.getValue());
                } else if ("To".equalsIgnoreCase(header.getName())) {
                    recipients.add(parseRecipientHeader(header.getValue()));
                }
            }
        }

        String body = extractBodyText(msg.getPayload());

        return Email.builder()
                .id(msg.getId())
                .threadId(msg.getThreadId())
                .sender(sender != null ? sender : EmailRecipient.of("Unknown", "unknown@gmail.com"))
                .recipients(recipients)
                .subject(subject)
                .body(body)
                .snippet(msg.getSnippet())
                .timestamp(timestamp)
                .read(isRead)
                .starred(isStarred)
                .labels(labelIds)
                .folder(labelIds.contains("INBOX") ? EmailFolder.INBOX : EmailFolder.ARCHIVE)
                .build();
    }

    private EmailRecipient parseRecipientHeader(String headerVal) {
        if (headerVal == null) return EmailRecipient.of("Unknown");
        if (headerVal.contains("<") && headerVal.contains(">")) {
            String name = headerVal.substring(0, headerVal.indexOf('<')).trim().replace("\"", "");
            String email = headerVal.substring(headerVal.indexOf('<') + 1, headerVal.indexOf('>')).trim();
            return EmailRecipient.of(name, email);
        }
        return EmailRecipient.of(headerVal.trim());
    }

    private String extractBodyText(MessagePart part) {
        if (part == null) return "";
        if (part.getBody() != null && part.getBody().getData() != null) {
            try {
                byte[] decoded = Base64.getUrlDecoder().decode(part.getBody().getData());
                return new String(decoded, StandardCharsets.UTF_8);
            } catch (IllegalArgumentException e) {
                return "";
            }
        }
        if (part.getParts() != null) {
            for (MessagePart childPart : part.getParts()) {
                if ("text/plain".equalsIgnoreCase(childPart.getMimeType())) {
                    return extractBodyText(childPart);
                }
            }
            for (MessagePart childPart : part.getParts()) {
                String subText = extractBodyText(childPart);
                if (!subText.isEmpty()) return subText;
            }
        }
        return "";
    }
}
