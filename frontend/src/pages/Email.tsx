import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmail } from '../hooks/useMail';
import { EmailDetail } from '../components/mail/EmailDetail';
import { Loader2 } from 'lucide-react';

export const Email: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: email, isLoading, error } = useEmail(id || null);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-base font-semibold text-white">Email not found</h3>
        <p className="text-xs text-slate-400 mt-1">The requested email does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Back to Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
      <EmailDetail email={email} onBack={() => navigate('/')} />
    </div>
  );
};
