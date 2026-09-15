package com.mailmanager.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplySuggestionResponse {

    private String suggestedReply;
    private ReplyTone tone;
    private String reasoning;
    private double confidence;
}
