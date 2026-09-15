package com.mailmanager.mail.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Email {

    private String id;
    private String threadId;
    private EmailRecipient sender;
    
    @Builder.Default
    private List<EmailRecipient> recipients = new ArrayList<>();
    
    @Builder.Default
    private List<EmailRecipient> cc = new ArrayList<>();
    
    @Builder.Default
    private List<EmailRecipient> bcc = new ArrayList<>();
    
    private String subject;
    private String body;
    private String snippet;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant timestamp;
    
    private boolean read;
    private boolean starred;
    
    @Builder.Default
    private List<String> labels = new ArrayList<>();
    
    @Builder.Default
    private List<Attachment> attachments = new ArrayList<>();

    @Builder.Default
    private EmailFolder folder = EmailFolder.INBOX;
}
