import React from 'react';
import { Sparkles, Search, PlusCircle, Settings, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMailProviderInfo } from '../../hooks/useMail';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onComposeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange, onComposeClick }) => {
  const { data: providerInfo } = useMailProviderInfo();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              AI Mail Manager
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini 2.5 Flash
            </div>
          </div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search emails by subject, sender, keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/70 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Actions & Provider Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onComposeClick}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Compose</span>
        </button>

        {/* Active Provider Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium truncate max-w-[120px]">
            {providerInfo?.activeProvider ? providerInfo.activeProvider.split(' ')[0] : 'Gmail'}
          </span>
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          title="Settings & Connections"
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-slate-700">
          AM
        </div>
      </div>
    </header>
  );
};
