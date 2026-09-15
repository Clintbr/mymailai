import React from 'react';
import { Paperclip, Mail } from 'lucide-react';
import type { Email } from '../../types/mail';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  isLoading: boolean;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  isLoading,
}) => {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 animate-pulse flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-slate-700/50 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
              <div className="h-4 bg-slate-700/30 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700/20 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-4 text-slate-500">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">No emails found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Your inbox is clean or no messages match your selected search/filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto">
      {emails.map((email) => {
        const isSelected = email.id === selectedEmailId;
        const senderName = email.sender?.name || email.sender?.email || 'Unknown';
        const senderInitials = senderName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        return (
          <div
            key={email.id}
            onClick={() => onSelectEmail(email.id)}
            className={`p-4 cursor-pointer transition-all flex items-start gap-3.5 group relative ${
              isSelected
                ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                : email.read
                ? 'hover:bg-slate-800/40 bg-slate-900/20'
                : 'hover:bg-slate-800/60 bg-slate-800/20 font-medium'
            }`}
          >
            {/* Unread Indicator */}
            {!email.read && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute left-1.5 top-5"></span>
            )}

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-semibold text-slate-200 shrink-0 shadow">
              {senderInitials}
            </div>

            {/* Content preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-sm truncate ${
                    !email.read ? 'text-white font-semibold' : 'text-slate-300 font-medium'
                  }`}
                >
                  {senderName}
                </span>
                <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                  {formatTime(email.timestamp)}
                </span>
              </div>

              <h4
                className={`text-sm truncate mb-1 ${
                  !email.read ? 'text-indigo-200 font-semibold' : 'text-slate-300'
                }`}
              >
                {email.subject || '(No Subject)'}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                {email.snippet || email.body?.substring(0, 120)}
              </p>

              {/* Labels & Badges */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {email.labels?.map((label) => {
                  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                  if (label === 'URGENT') badgeColor = 'bg-rose-950/60 text-rose-300 border-rose-800/60';
                  if (label === 'CAREER' || label === 'JOB') badgeColor = 'bg-purple-950/60 text-purple-300 border-purple-800/60';
                  if (label === 'WORK') badgeColor = 'bg-blue-950/60 text-blue-300 border-blue-800/60';
                  if (label === 'FINANCE') badgeColor = 'bg-amber-950/60 text-amber-300 border-amber-800/60';

                  return (
                    <span
                      key={label}
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}
                    >
                      {label}
                    </span>
                  );
                })}

                {email.attachments && email.attachments.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                    <Paperclip className="w-3 h-3 text-slate-400" />
                    {email.attachments.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
