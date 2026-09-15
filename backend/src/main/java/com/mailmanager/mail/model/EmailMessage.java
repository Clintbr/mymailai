package com.mailmanager.mail.model;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailMessage {

    @NotEmpty(message = "At least one recipient is required")
    @Builder.Default
    private List<EmailRecipient> to = new ArrayList<>();

    @Builder.Default
    private List<EmailRecipient> cc = new ArrayList<>();

    @Builder.Default
    private List<EmailRecipient> bcc = new ArrayList<>();

    private String subject;

    @NotEmpty(message = "Email body cannot be empty")
    private String body;

    private String inReplyTo;
    private String threadId;
}
