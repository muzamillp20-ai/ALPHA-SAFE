import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { useState, useEffect, useCallback } from 'react';
import Login from './pages/Login';
import Command from './pages/Command';
import Scan from './pages/Scan';
import Learn from './pages/Learn';
import Respond from './pages/Respond';
import Profile from './pages/Profile';
import ComplaintCenter from './pages/ComplaintCenter';
import ReviewPage from './pages/ReviewPage';

function AppContent() {
  const { state } = useStore();

  return (
    <HashRouter>
      <Routes>
        <Route path="/review/:token" element={<ReviewPage />} />
        <Route path="/*" element={state.isAuthenticated ? <AppLayout /> : <Login />} />
      </Routes>
    </HashRouter>
  );
}

function AppLayout() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [cmdPalette, setCmdPalette] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = [
    { path: '/command', label: 'Command', icon: '◈' },
    { path: '/scan', label: 'Investigate', icon: '◎' },
    { path: '/learn', label: 'Learn', icon: '◉' },
    { path: '/complaints', label: 'Complaints', icon: '⊞' },
    { path: '/respond', label: 'Respond', icon: '⚡' },
    { path: '/profile', label: 'Profile', icon: '○' },
  ];

  // Command palette shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPalette(p => !p);
      }
      if (e.key === 'Escape') {
        setCmdPalette(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  }, [dispatch, navigate]);

  const unreadNotifs = state.notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu">
              <span className="text-lg">☰</span>
            </button>
            <button onClick={() => navigate('/command')} className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>ALPHA</span>
              <span className="text-xl font-light tracking-tight" style={{ color: 'var(--text-secondary)' }}>SAFE</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdPalette(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <span>⌘K</span>
              <span>Search...</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg relative"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Notifications"
              >
                <span className="text-lg">◔</span>
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium" style={{ background: 'var(--danger)', color: '#fff' }}>
                    {unreadNotifs}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl border shadow-2xl z-50 overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm font-medium">Notifications</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {state.notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</div>
                    ) : (
                      state.notifications.slice(0, 10).map(n => (
                        <button
                          key={n.id}
                          onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                          className="w-full text-left p-3 border-b text-sm hover:opacity-80 transition-opacity"
                          style={{ borderColor: 'var(--border)', opacity: n.read ? 0.6 : 1 }}
                        >
                          {n.text}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-sm"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Logout"
              title="Logout"
            >
              <span className="text-lg">⏻</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col w-56 border-r shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex-1 py-4 px-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: location.pathname === item.path ? 'var(--accent-dim)' : 'transparent',
                  color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === item.path ? 500 : 400,
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs px-3" style={{ color: 'var(--text-muted)' }}>
              {state.user?.name || 'User'}
            </div>
          </div>
        </nav>

        {/* Mobile Nav Overlay */}
        {mobileNav && (
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileNav(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <nav className="absolute left-0 top-14 bottom-0 w-64 p-4 space-y-1" style={{ background: 'var(--surface)' }} onClick={e => e.stopPropagation()}>
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileNav(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm"
                  style={{
                    background: location.pathname === item.path ? 'var(--accent-dim)' : 'transparent',
                    color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Routes>
            <Route path="/command" element={<Command />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/complaints" element={<ComplaintCenter />} />
            <Route path="/respond" element={<Respond />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/command" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 z-30" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px]"
            style={{ color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Command Palette */}
      {cmdPalette && (
        <CommandPalette onClose={() => setCmdPalette(false)} />
      )}
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const commands = [
    { label: 'Analyze URL', action: () => navigate('/scan?tab=url') },
    { label: 'Analyze Message', action: () => navigate('/scan?tab=message') },
    { label: 'Start Flashcards', action: () => navigate('/learn?section=flashcards') },
    { label: 'Scam Arena', action: () => navigate('/learn?section=arena') },
    { label: 'Phishing Lab', action: () => navigate('/learn?section=phishing') },
    { label: 'Emergency Response', action: () => navigate('/respond?section=emergency') },
    { label: 'Create Incident', action: () => navigate('/respond?section=incident') },
    { label: 'Complaint Builder', action: () => navigate('/respond?section=complaint') },
    { label: 'Complaint Practice Center', action: () => navigate('/complaints') },
    { label: 'Evidence Vault', action: () => navigate('/respond?section=evidence') },
    { label: 'Security Health', action: () => navigate('/profile?section=health') },
    { label: 'Settings', action: () => navigate('/profile?section=settings') },
  ];

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden animate-fade-in"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filtered.length > 0) {
                filtered[0].action();
                onClose();
              }
            }}
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd, i) => (
            <button
              key={i}
              onClick={() => { cmd.action(); onClose(); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No matching commands</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
