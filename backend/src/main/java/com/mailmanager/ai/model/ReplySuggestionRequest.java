package com.mailmanager.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplySuggestionRequest {

    private String emailId;

    @Builder.Default
    private ReplyTone tone = ReplyTone.PROFESSIONAL;

    private String customInstructions;

    private String recipientName;
}
