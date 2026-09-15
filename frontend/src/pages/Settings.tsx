import React from 'react';
import {
  Settings as SettingsIcon,
  Sparkles,
  ShieldCheck,
  Mail,
  Key,
  CheckCircle2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMailProviderInfo } from '../hooks/useMail';
import { useAiStatus } from '../hooks/useAi';

export const Settings: React.FC = () => {
  const { data: providerInfo } = useMailProviderInfo();
  const { data: aiStatus } = useAiStatus();

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-8">
      {/* Header with Back button */}
      <div>
        <div className="mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inbox</span>
          </Link>
        </div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          <span>System Settings & Connections</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Google Gemini AI models, Google Cloud OAuth 2.0 credentials, and mail providers.
        </p>
      </div>

      {/* Gemini AI Status Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Google Gemini AI Integration
              </h3>
              <p className="text-xs text-slate-400">
                Powers email classification, priority scoring, and reply draft synthesis
              </p>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium border flex items-center gap-1.5 ${
              aiStatus?.configured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                aiStatus?.configured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            {aiStatus?.configured ? 'API Connected' : 'Simulated / Standby Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400">Configured Model:</span>
            <p className="font-mono text-indigo-300 font-semibold text-sm">
              {aiStatus?.model || 'gemini-2.5-flash'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400">Provider:</span>
            <p className="font-medium text-slate-200 text-sm">
              Google AI Studio (Gemini REST API)
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            <span>How to configure your live Gemini API key</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>
              Generate a free API key at{' '}
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline inline-flex items-center gap-0.5"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Set <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">GEMINI_API_KEY=your_key</code> in your backend environment or <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">.env</code></li>
            <li>Restart the Spring Boot backend to load the live credentials</li>
          </ol>
        </div>
      </div>

      {/* Mail Provider Status Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Mail Provider Abstraction
              </h3>
              <p className="text-xs text-slate-400">
                Official Gmail API client with modular architecture for Outlook/IMAP
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full font-medium border bg-blue-500/10 text-blue-400 border-blue-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Active: {providerInfo?.activeProvider || 'MOCK'}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-slate-200">
            Connecting Google Cloud OAuth 2.0 Credentials
          </p>
          <p className="text-slate-400 leading-relaxed">
            To link your personal or workspace Gmail account, create an OAuth 2.0 Client in Google Cloud Console with the <code className="bg-slate-800 px-1 rounded text-slate-300">https://www.googleapis.com/auth/gmail.modify</code> scope. Set <code className="bg-slate-800 px-1 rounded text-slate-300">GOOGLE_CLIENT_ID</code> and <code className="bg-slate-800 px-1 rounded text-slate-300">GOOGLE_CLIENT_SECRET</code>.
          </p>
        </div>
      </div>

      {/* Security & Architectural Guarantees */}
      <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
          <ShieldCheck className="w-5 h-5" />
          <span>Architectural Safeguards & Privacy</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1.5">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>No Database Storage:</strong> Your emails and credentials are never persisted in a local database. Gmail remains the single source of truth.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Human-in-the-Loop:</strong> The AI will never auto-send emails. All suggestions require explicit user review, edit capability, and manual send confirmation.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Secure Key Architecture:</strong> Gemini API keys and OAuth secrets are handled exclusively by Spring Boot backend environment variables and never exposed to the frontend browser.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
