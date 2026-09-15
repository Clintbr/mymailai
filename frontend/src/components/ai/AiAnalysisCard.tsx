import React from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Flame,
  Tag
} from 'lucide-react';
import type { EmailAnalysis, EmailPriority, SuggestedAction } from '../../types/ai';

interface AiAnalysisCardProps {
  analysis: EmailAnalysis | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({
  analysis,
  isLoading,
  onAnalyze,
}) => {
  const getPriorityBadge = (priority: EmailPriority) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            URGENT
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            LOW
          </span>
        );
    }
  };

  const getActionBadge = (action: SuggestedAction) => {
    switch (action) {
      case 'REPLY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Draft Reply
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Review Needed
          </span>
        );
      case 'ARCHIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            Safe to Archive
          </span>
        );
      case 'NO_ACTION':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            No Action
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/60 p-5 backdrop-blur-sm shadow-xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Gemini AI Insights
            </h3>
            <p className="text-[11px] text-slate-400">
              Automated classification & intent analysis
            </p>
          </div>
        </div>

        {analysis ? (
          <div className="flex items-center gap-2 text-[11px] text-indigo-300 font-medium bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/50">
            <span>Confidence:</span>
            <span className="font-bold text-indigo-200">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
        ) : (
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Analyzing...' : 'Analyze with Gemini'}</span>
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3 py-3 animate-pulse">
          <div className="h-4 bg-indigo-900/40 rounded w-1/3"></div>
          <div className="h-4 bg-indigo-900/20 rounded w-full"></div>
          <div className="h-4 bg-indigo-900/20 rounded w-4/5"></div>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          {/* Key metadata pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Category */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Tag className="w-3 h-3 text-purple-400" />
              {analysis.category}
            </span>

            {/* Priority */}
            {getPriorityBadge(analysis.priority)}

            {/* Suggested Action */}
            {getActionBadge(analysis.suggestedAction)}

            {/* Requires Response indicator */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                analysis.requiresResponse
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
              }`}
            >
              Response: {analysis.requiresResponse ? 'Required' : 'Optional'}
            </span>
          </div>

          {/* AI Executive Summary */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3.5 text-xs text-slate-200 leading-relaxed">
            <p className="font-semibold text-indigo-300 mb-1">Summary</p>
            <p className="text-slate-300">{analysis.summary}</p>
          </div>

          {/* Key Points */}
          {analysis.keyPoints && analysis.keyPoints.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Key Takeaways
              </p>
              <ul className="space-y-1 text-xs text-slate-300">
                {analysis.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-slate-400">
          Click <strong className="text-indigo-300">Analyze with Gemini</strong> above to automatically categorize this email, evaluate priority, and synthesize key action items.
        </div>
      )}
    </div>
  );
};
