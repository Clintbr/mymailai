package com.mailmanager.ai.service;

import com.mailmanager.ai.model.EmailAnalysis;
import com.mailmanager.ai.model.ReplySuggestionRequest;
import com.mailmanager.ai.model.ReplySuggestionResponse;
import com.mailmanager.mail.model.Email;

public interface AiService {

    EmailAnalysis analyzeEmail(Email email);

    ReplySuggestionResponse generateReply(Email email, ReplySuggestionRequest request);

    boolean isConfigured();

    String getModelName();
}
