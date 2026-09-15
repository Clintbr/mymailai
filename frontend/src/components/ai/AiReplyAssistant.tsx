import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  MessageSquare
} from 'lucide-react';
import type { Email } from '../../types/mail';
import type { ReplySuggestionResponse, ReplyTone } from '../../types/ai';

interface AiReplyAssistantProps {
  email?: Email;
  onGenerateReply: (tone: ReplyTone, instructions: string) => Promise<ReplySuggestionResponse>;
  onSendReply: (replyBody: string) => Promise<void>;
  isGenerating: boolean;
  isSending: boolean;
}

export const AiReplyAssistant: React.FC<AiReplyAssistantProps> = ({
  onGenerateReply,
  onSendReply,
  isGenerating,
  isSending,
}) => {
  const [tone, setTone] = useState<ReplyTone>('PROFESSIONAL');
  const [customInstructions, setCustomInstructions] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const tones: { id: ReplyTone; label: string }[] = [
    { id: 'PROFESSIONAL', label: 'Professional' },
    { id: 'FRIENDLY', label: 'Friendly' },
    { id: 'CONCISE', label: 'Concise' },
    { id: 'FORMAL', label: 'Formal' },
    { id: 'DIRECT', label: 'Direct' },
  ];

  const handleGenerate = async () => {
    try {
      const res = await onGenerateReply(tone, customInstructions);
      setReplyDraft(res.suggestedReply);
      setAiReasoning(res.reasoning);
      setHasGenerated(true);
      setSendSuccess(false);
    } catch (e) {
      console.error('Failed to generate reply', e);
    }
  };

  const handleSend = async () => {
    if (!replyDraft.trim()) return;
    try {
      await onSendReply(replyDraft);
      setSendSuccess(true);
      setTimeout(() => {
        setReplyDraft('');
        setHasGenerated(false);
        setSendSuccess(false);
      }, 3000);
    } catch (e) {
      console.error('Failed to send reply', e);
    }
  };

  const handleDiscard = () => {
    setReplyDraft('');
    setHasGenerated(false);
    setAiReasoning('');
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              AI Reply Assistant
            </h3>
            <p className="text-[11px] text-slate-400">
              Draft smart replies with contextual awareness & tone controls
            </p>
          </div>
        </div>

        {/* Human in the loop badge */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Human-in-the-loop Protected</span>
        </div>
      </div>

      {/* Tone & Prompt Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Tone Selection
          </label>
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            Adapts vocabulary & formalities
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                tone === t.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Custom Instructions */}
        <div>
          <input
            type="text"
            placeholder="Optional prompt guidance (e.g. 'I am free on Friday at 3pm')..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/70 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Generate / Regenerate Action */}
        <div className="flex items-center justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>{isGenerating ? 'Drafting with Gemini...' : hasGenerated ? 'Regenerate Draft' : 'Generate Reply Draft'}</span>
          </button>
        </div>
      </div>

      {/* Reply Draft Editor Area */}
      {hasGenerated && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Editable Response Draft</span>
            </div>
            {aiReasoning && (
              <span className="text-[11px] text-slate-400 italic truncate max-w-sm">
                {aiReasoning}
              </span>
            )}
          </div>

          <textarea
            rows={7}
            value={replyDraft}
            onChange={(e) => setReplyDraft(e.target.value)}
            className="w-full bg-slate-950/80 border border-indigo-500/40 rounded-xl p-3 sm:p-3.5 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            placeholder="Edit the draft before sending..."
          />

          {sendSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Email reply was successfully sent via Gmail API!</span>
            </div>
          )}

          {/* Review & Send Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3">
            <button
              onClick={handleDiscard}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Tone</span>
              </button>

              <button
                onClick={handleSend}
                disabled={isSending || !replyDraft.trim() || sendSuccess}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending via Gmail...' : 'Approve & Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
