import { useStore, getAwarenessScore, getCategoryScore, addActivity } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Command() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const overallScore = getAwarenessScore(state);
  const categories = [
    { key: 'phishing', label: 'Phishing', icon: '◈' },
    { key: 'scams', label: 'Scam Awareness', icon: '◎' },
    { key: 'apps', label: 'App Safety', icon: '◉' },
    { key: 'privacy', label: 'Privacy', icon: '◐' },
    { key: 'response', label: 'Response', icon: '⚡' },
  ];

  const categoryScores = categories.map(c => ({
    ...c,
    score: getCategoryScore(state, c.key),
  }));

  // Generate recommendations from actual state
  const recommendations: { text: string; action: string; path: string }[] = [];
  
  const phishingCards = state.flashcardProgress.filter(f => f.category === 'phishing' && !f.known);
  if (phishingCards.length > 0) {
    recommendations.push({ text: `You missed ${phishingCards.length} phishing flashcard(s)`, action: 'Review now', path: '/learn?section=flashcards' });
  }
  
  if (categoryScores.find(c => c.key === 'apps' && c.score < 50 && state.flashcardProgress.some(f => f.category === 'apps'))) {
    recommendations.push({ text: 'Your app-safety knowledge needs improvement', action: 'Start learning', path: '/learn?section=flashcards' });
  }
  
  const healthItems = Object.values(state.securityHealth).filter(Boolean).length;
  if (healthItems < 7) {
    recommendations.push({ text: `Security checklist: ${healthItems}/7 items completed`, action: 'Continue', path: '/profile?section=health' });
  }

  if (state.scenarioAttempts.length === 0 && state.flashcardProgress.length > 5) {
    recommendations.push({ text: 'Test your knowledge in the Scam Arena', action: 'Try it', path: '/learn?section=arena' });
  }

  if (recommendations.length === 0) {
    recommendations.push({ text: 'Start by analyzing a suspicious URL or message', action: 'Investigate', path: '/scan' });
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {getGreeting()}, {state.user?.name || 'User'}.
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Your cyber-safety status, learning progress, and recommended actions.
        </p>
      </div>

      {/* Cyber State - Hero Section */}
      <div className="rounded-2xl border p-6 sm:p-8 mb-6 relative overflow-hidden animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative z-10">
          <div className="text-xs font-medium tracking-wider uppercase mb-6" style={{ color: 'var(--text-muted)' }}>
            Current Cyber State
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Central Score */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--border)" strokeWidth="6" />
                  <circle
                    cx="100" cy="100" r="85" fill="none"
                    stroke="var(--accent)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallScore / 100) * 534} 534`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {overallScore}
                  </span>
                  <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
              <div className="mt-3 text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                Awareness Index
              </div>
            </div>

            {/* Category Dimensions */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryScores.map((cat, i) => (
                  <div
                    key={cat.key}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:border-[var(--border-light)]"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', animationDelay: `${i * 100}ms` }}
                  >
                    <span className="text-lg" style={{ color: 'var(--accent)' }}>{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{cat.label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${cat.score}%`, background: 'var(--accent)' }}
                          />
                        </div>
                        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{cat.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Needs Attention */}
      <div className="rounded-2xl border p-6 mb-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '100ms' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          What Needs Your Attention
        </div>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec, i) => (
            <button
              key={i}
              onClick={() => navigate(rec.path)}
              className="w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all hover:border-[var(--border-light)]"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
            >
              <span className="text-xs font-mono w-6" style={{ color: 'var(--text-muted)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{rec.text}</span>
              <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                {rec.action}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Threat Pulse - Interactive Constellation */}
      <div className="rounded-2xl border p-6 mb-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '200ms' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Threat Pulse
        </div>
        <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
          Your awareness across threat categories. Tap to explore.
        </p>
        <div className="relative flex items-center justify-center py-8">
          {/* Central node */}
          <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center z-10" style={{ borderColor: 'var(--accent)', background: 'var(--accent-dim)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>α</span>
          </div>
          {/* Surrounding nodes */}
          {categories.map((cat, i) => {
            const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const score = getCategoryScore(state, cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => navigate('/learn?section=flashcards')}
                className="absolute flex flex-col items-center gap-1 group"
                style={{ left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
              >
                <div
                  className="w-12 h-12 rounded-full border flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ borderColor: score > 0 ? 'var(--accent)' : 'var(--border)', background: score > 0 ? 'var(--accent-dim)' : 'var(--surface-2)' }}
                >
                  <span className="text-sm">{cat.icon}</span>
                </div>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{cat.label}</span>
              </button>
            );
          })}
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.2 }}>
            {categories.map((_, i) => {
              const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <line
                  key={i}
                  x1="50%" y1="50%"
                  x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`}
                  stroke="var(--border)" strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
        {[
          { label: 'Analyze URL', icon: '◎', path: '/scan?tab=url' },
          { label: 'Scam Arena', icon: '⚔', path: '/learn?section=arena' },
          { label: 'Complaints', icon: '⊞', path: '/complaints' },
          { label: 'Emergency', icon: '⚡', path: '/respond?section=emergency' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="p-4 rounded-xl border text-center transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <span className="text-2xl block mb-2">{action.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
