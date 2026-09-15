import React from 'react';
import { ExternalLink, FileCode, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 text-xs text-slate-400 shrink-0 select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        {/* Left: Title, Version, & Description */}
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-slate-200 tracking-tight flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Mail Manager API
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 text-[10px] font-mono text-indigo-300 font-medium">
              v1.0.0
            </span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <p className="text-[11px] text-slate-400 truncate max-w-lg hidden lg:block">
            REST API for AI-powered email management with Gmail integration and Google Gemini AI analysis & reply draft generation.
          </p>
        </div>

        {/* Right: Team, License, & Swagger Docs Links */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap justify-center">
          {/* Team / Author */}
          <a
            href="https://github.com/Clintbr"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-300 hover:text-indigo-400 transition-colors"
            title="AI Mail Manager Team on GitHub"
          >
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>AI Mail Manager Founder</span>
          </a>
          {/* Contact / Author */}
          <a
              href="https://clintbr.github.io/mein_Portfolio/kontakt.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-indigo-400 transition-colors"
              title="Contact Founder"
          >
            <svg
                className="w-3.5 h-3.5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
              <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>Contact me</span>
          </a>

          {/* License */}
          <a
            href="https://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="View Apache 2.0 License"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>Apache 2.0</span>
          </a>

          {/* Swagger / OpenAPI Spec Link */}
          <a
            href="https://mymailai.onrender.com/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
            title="Open Swagger UI API Documentation"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>OpenAPI Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
