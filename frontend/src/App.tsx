import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Inbox } from './pages/Inbox';
import { Email } from './pages/Email';
import { Settings } from './pages/Settings';
import { ComposeModal } from './components/mail/ComposeModal';
import { useEmails } from './hooks/useMail';
import type { EmailCategory } from './types/ai';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

function AppContent() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory | 'ALL' | 'IMPORTANT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { data: emails = [] } = useEmails();
  const unreadCount = emails.filter((e) => !e.read).length;

  const isSettingsPage = location.pathname === '/settings';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onComposeClick={() => setIsComposeOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        showSidebarToggle={!isSettingsPage}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Left Sidebar - Hidden on /settings, responsive drawer on mobile/tablet */}
        {!isSettingsPage && (
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            unreadCount={unreadCount}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 flex overflow-hidden min-w-0">
          <Routes>
            <Route
              path="/"
              element={
                <Inbox
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route path="/mail/:id" element={<Email />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>

      {/* Responsive Footer */}
      <Footer />

      {/* Outbound Compose Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
