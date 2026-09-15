import React from 'react';
import {
  Inbox,
  Star,
  Sparkles,
  Settings,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { EmailCategory } from '../../types/ai';

interface SidebarProps {
  selectedCategory: EmailCategory | 'ALL' | 'IMPORTANT';
  onSelectCategory: (cat: EmailCategory | 'ALL' | 'IMPORTANT') => void;
  unreadCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  unreadCount,
  isOpen = false,
  onClose,
}) => {
  const location = useLocation();
  const isInboxPage = location.pathname === '/' || location.pathname.startsWith('/mail');

  const handleSelect = (cat: EmailCategory | 'ALL' | 'IMPORTANT') => {
    onSelectCategory(cat);
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 select-none">
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-white">Mail Navigation</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Nav */}
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Mailboxes
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => handleSelect('ALL')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isInboxPage && selectedCategory === 'ALL'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4 text-indigo-400" />
                <span>All Inboxes</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500 text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelect('IMPORTANT')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isInboxPage && selectedCategory === 'IMPORTANT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Important</span>
              </div>
            </button>
          </nav>
        </div>

        {/* AI Categorization Filters */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Smart Categories
            </p>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => handleSelect('JOB')}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'JOB'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span>Job & Career</span>
            </button>

            <button
              onClick={() => handleSelect('WORK')}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'WORK'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Work Projects</span>
            </button>

            <button
              onClick={() => handleSelect('PERSONAL')}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'PERSONAL'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>Personal</span>
            </button>

            <button
              onClick={() => handleSelect('FINANCE')}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'FINANCE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span>Finance & Invoices</span>
            </button>

            <button
              onClick={() => handleSelect('NEWSLETTER')}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'NEWSLETTER'
                  ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <span>Newsletters</span>
            </button>

            <button
              onClick={() => handleSelect('SUPPORT')}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'SUPPORT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <span>Customer Support</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-slate-800 pt-3 space-y-1">
        <Link
          to="/settings"
          onClick={() => onClose && onClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            location.pathname === '/settings'
              ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Gemini API</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-800 bg-slate-900/50 flex-col shrink-0 h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 h-full overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
