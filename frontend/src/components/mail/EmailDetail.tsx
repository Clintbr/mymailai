import React, { useEffect, useState } from 'react';
import {
  Archive,
  MailCheck,
  Mail,
  Paperclip,
  Clock,
  ArrowLeft,
  FileText
} from 'lucide-react';
import type { Email } from '../../types/mail';
import type { EmailAnalysis, ReplySuggestionResponse, ReplyTone } from '../../types/ai';
import { AiAnalysisCard } from '../ai/AiAnalysisCard';
import { AiReplyAssistant } from '../ai/AiReplyAssistant';
import { useAnalyzeEmail, useGenerateReply } from '../../hooks/useAi';
import { useMarkRead, useMarkUnread, useArchiveEmail, useSendEmail } from '../../hooks/useMail';

interface EmailDetailProps {
  email: Email;
  onBack?: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack }) => {
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);

  const analyzeMutation = useAnalyzeEmail();
  const generateReplyMutation = useGenerateReply();
  const markReadMutation = useMarkRead();
  const markUnreadMutation = useMarkUnread();
  const archiveMutation = useArchiveEmail();
  const sendEmailMutation = useSendEmail();

  useEffect(() => {
    // Automatically mark email as read when opened if unread
    if (!email.read) {
      markReadMutation.mutate(email.id);
    }
  }, [email.id]);

  const handleAnalyze = async () => {
    try {
      const res = await analyzeMutation.mutateAsync(email.id);
      setAnalysis(res);
    } catch (e) {
      console.error('Failed to analyze email', e);
    }
  };

  const handleGenerateReply = async (
    tone: ReplyTone,
    instructions: string
  ): Promise<ReplySuggestionResponse> => {
    return await generateReplyMutation.mutateAsync({
      emailId: email.id,
      request: {
        tone,
        customInstructions: instructions,
        recipientName: email.sender?.name,
      },
    });
  };

  const handleSendReply = async (replyBody: string) => {
    await sendEmailMutation.mutateAsync({
      to: [email.sender],
      subject: email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject || ''}`,
      body: replyBody,
      inReplyTo: email.id,
      threadId: email.threadId,
    });
  };

  const formatFullDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Back to email list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {email.subject || '(No Subject)'}
          </h2>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {email.read ? (
            <button
              onClick={() => markUnreadMutation.mutate(email.id)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              title="Mark as unread"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Mark Unread</span>
            </button>
          ) : (
            <button
              onClick={() => markReadMutation.mutate(email.id)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              title="Mark as read"
            >
              <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark Read</span>
            </button>
          )}

          <button
            onClick={() => archiveMutation.mutate(email.id)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            title="Archive email"
          >
            <Archive className="w-3.5 h-3.5 text-slate-400" />
            <span>Archive</span>
          </button>
        </div>
      </div>

      {/* Sender / Recipient Metadata Card */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-md shrink-0">
            {email.sender?.name ? email.sender.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-semibold text-white text-xs sm:text-sm">
                {email.sender?.name || 'Unknown'}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 truncate">
                &lt;{email.sender?.email}&gt;
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              To: {email.recipients?.map((r) => r.name || r.email).join(', ') || 'me'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 whitespace-nowrap self-end sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatFullDate(email.timestamp)}</span>
        </div>
      </div>

      {/* Gemini AI Analysis Section */}
      <AiAnalysisCard
        analysis={analysis}
        isLoading={analyzeMutation.isPending}
        onAnalyze={handleAnalyze}
      />

      {/* Original Email Content */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Original Message Body
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {email.body?.length || 0} characters
          </span>
        </div>

        <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans break-words">
          {email.body}
        </div>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
              <span>Attachments ({email.attachments.length})</span>
            </p>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {email.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-medium truncate max-w-[150px]">{att.filename}</span>
                  <span className="text-slate-400 text-[10px]">
                    ({Math.round(att.size / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gemini AI Reply Assistant (Human-In-The-Loop) */}
      <AiReplyAssistant
        email={email}
        onGenerateReply={handleGenerateReply}
        onSendReply={handleSendReply}
        isGenerating={generateReplyMutation.isPending}
        isSending={sendEmailMutation.isPending}
      />
    </div>
  );
};
