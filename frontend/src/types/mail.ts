export interface EmailRecipient {
  name?: string;
  email: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

export type EmailFolder = 'INBOX' | 'IMPORTANT' | 'SENT' | 'DRAFT' | 'ARCHIVE' | 'TRASH' | 'SPAM';

export interface Email {
  id: string;
  threadId?: string;
  sender: EmailRecipient;
  recipients: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  body: string;
  snippet?: string;
  timestamp: string;
  read: boolean;
  starred?: boolean;
  labels?: string[];
  attachments?: Attachment[];
  folder?: EmailFolder;
}

export interface EmailMessage {
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  subject: string;
  body: string;
  inReplyTo?: string;
  threadId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}
