import React from 'react';
import { Sparkles, Search, PlusCircle, Settings, Mail, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMailProviderInfo } from '../../hooks/useMail';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onComposeClick: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onComposeClick,
  onToggleSidebar,
  showSidebarToggle = true,
}) => {
  const { data: providerInfo } = useMailProviderInfo();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-2">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {showSidebarToggle && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Sidebar Menu"
            aria-label="Toggle Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              AI Mail Manager
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini 2.5 Flash
            </div>
          </div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-1 sm:mx-4 md:mx-6 min-w-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/70 rounded-full pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
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

      {/* Actions & Status */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={onComposeClick}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Compose</span>
        </button>

        {/* Active Provider Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium truncate max-w-[120px]">
            {providerInfo?.activeProvider ? providerInfo.activeProvider.split(' ')[0] : 'Gmail'}
          </span>
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          title="Settings & Connections"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>

        {/* User Avatar */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white ring-2 ring-slate-700 shrink-0">
          AM
        </div>
      </div>
    </header>
  );
};
