import React, { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { useEmails } from '../hooks/useMail';
import { EmailList } from '../components/mail/EmailList';
import { EmailDetail } from '../components/mail/EmailDetail';
import type { Email } from '../types/mail';
import type { EmailCategory } from '../types/ai';

interface InboxProps {
  selectedCategory: EmailCategory | 'ALL' | 'IMPORTANT';
  searchQuery: string;
}

export const Inbox: React.FC<InboxProps> = ({ selectedCategory, searchQuery }) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const { data: emails = [], isLoading } = useEmails(searchQuery);

  // Filter emails based on category or important flag
  const filteredEmails = emails.filter((email: Email) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'IMPORTANT') return email.starred || email.labels?.includes('IMPORTANT') || email.labels?.includes('URGENT');
    return email.labels?.includes(selectedCategory);
  });

  const selectedEmail = emails.find((e: Email) => e.id === selectedEmailId) || null;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Middle Pane: Email List */}
      <div
        className={`${
          selectedEmailId ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-96 flex-col border-r border-slate-800 bg-slate-900/30 overflow-hidden shrink-0`}
      >
        {/* Inbox Subheader / Filter Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              {selectedCategory === 'ALL'
                ? 'All Messages'
                : selectedCategory === 'IMPORTANT'
                ? 'Important & Urgent'
                : `${selectedCategory} Emails`}
            </h2>
            <p className="text-[11px] text-slate-400">
              {filteredEmails.length} {filteredEmails.length === 1 ? 'message' : 'messages'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-[11px] text-indigo-300 font-medium">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>AI Ready</span>
          </div>
        </div>

        {/* Email List Component */}
        <EmailList
          emails={filteredEmails}
          selectedEmailId={selectedEmailId}
          onSelectEmail={(id: string) => setSelectedEmailId(id)}
          isLoading={isLoading}
        />
      </div>

      {/* Right Pane: Email Detail & AI Workbench */}
      <div
        className={`${
          !selectedEmailId ? 'hidden lg:flex' : 'flex'
        } flex-1 flex-col overflow-hidden bg-slate-950/40`}
      >
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onBack={() => setSelectedEmailId(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-center mb-4 text-indigo-400 shadow-xl shadow-indigo-950/50">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Select an email to view AI Insights
            </h3>
            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
              Open any conversation to automatically inspect category classifications, urgency scoring, bullet summaries, and craft intelligent replies with human-in-the-loop review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
