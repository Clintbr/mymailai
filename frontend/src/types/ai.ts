export type EmailCategory =
  | 'JOB'
  | 'WORK'
  | 'PERSONAL'
  | 'FINANCE'
  | 'SHOPPING'
  | 'NEWSLETTER'
  | 'SUPPORT'
  | 'OTHER';

export type EmailPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SuggestedAction = 'NO_ACTION' | 'REPLY' | 'REVIEW' | 'ARCHIVE';

export type ReplyTone = 'PROFESSIONAL' | 'FRIENDLY' | 'CONCISE' | 'FORMAL' | 'DIRECT';

export interface EmailAnalysis {
  category: EmailCategory;
  priority: EmailPriority;
  summary: string;
  language: string;
  requiresResponse: boolean;
  suggestedAction: SuggestedAction;
  confidence: number;
  keyPoints?: string[];
  detectedSentiment?: string;
}

export interface ReplySuggestionRequest {
  emailId?: string;
  tone?: ReplyTone;
  customInstructions?: string;
  recipientName?: string;
}

export interface ReplySuggestionResponse {
  suggestedReply: string;
  tone: ReplyTone;
  reasoning: string;
  confidence: number;
}

export interface AiStatus {
  configured: boolean;
  model: string;
  provider: string;
}
