package com.mailmanager.ai.model;

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
public class EmailAnalysis {

    private EmailCategory category;
    private EmailPriority priority;
    private String summary;
    private String language;
    private boolean requiresResponse;
    private SuggestedAction suggestedAction;
    private double confidence;

    @Builder.Default
    private List<String> keyPoints = new ArrayList<>();

    private String detectedSentiment;
}
