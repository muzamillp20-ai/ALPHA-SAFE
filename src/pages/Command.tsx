import { useState } from 'react';
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

  // Generate recommendations from actual state — NO FAKE DATA
  const recommendations: { text: string; action: string; path: string }[] = [];
  
  const missedCards = state.flashcardProgress.filter(f => !f.known);
  if (missedCards.length > 0) {
    recommendations.push({ text: `Review ${missedCards.length} missed flashcard(s) to strengthen knowledge`, action: 'Review now', path: '/learn?section=flashcards' });
  }
  
  const lowCategories = categoryScores.filter(c => c.score > 0 && c.score < 50);
  if (lowCategories.length > 0) {
    recommendations.push({ text: `${lowCategories[0].label} needs more practice (${lowCategories[0].score}%)`, action: 'Learn more', path: '/learn?section=flashcards' });
  }
  
  const healthItems = Object.values(state.securityHealth).filter(Boolean).length;
  if (healthItems < 7) {
    recommendations.push({ text: `Security checklist: ${healthItems}/7 items completed`, action: 'Continue', path: '/profile?section=health' });
  }

  if (state.scenarioAttempts.length === 0 && state.flashcardProgress.length >= 3) {
    recommendations.push({ text: 'Test your knowledge in a realistic scam scenario', action: 'Try it', path: '/learn?section=arena' });
  }

  if (state.incidents.length === 0 && state.flashcardProgress.length >= 5) {
    recommendations.push({ text: 'Practice creating a complaint draft', action: 'Start', path: '/complaints' });
  }

  if (recommendations.length === 0 && state.flashcardProgress.length === 0) {
    recommendations.push({ text: 'Begin your cyber safety journey with flashcards', action: 'Start learning', path: '/learn?section=flashcards' });
  }
  
  if (recommendations.length === 0) {
    recommendations.push({ text: 'Analyze a suspicious URL or message', action: 'Investigate', path: '/scan' });
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

      {/* Threat Pulse - Uniform Table */}
      <div className="rounded-2xl border p-6 mb-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            Threat Pulse
          </div>
          <button onClick={() => navigate('/learn?section=flashcards')} className="text-xs" style={{ color: 'var(--accent)' }}>
            View All →
          </button>
        </div>
        <div className="space-y-2">
          {categoryScores.map((cat) => {
            const status = cat.score === 0 ? 'Not started' : cat.score >= 80 ? 'Strong' : cat.score >= 50 ? 'Developing' : 'Needs Practice';
            const statusColor = cat.score === 0 ? 'var(--text-muted)' : cat.score >= 80 ? 'var(--success)' : cat.score >= 50 ? 'var(--warning)' : 'var(--danger)';
            return (
              <button
                key={cat.key}
                onClick={() => navigate('/learn?section=flashcards')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:border-[var(--border-light)]"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
              >
                <span className="text-lg w-8">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{cat.score}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${cat.score}%`, background: statusColor }} />
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ background: `${statusColor}15`, color: statusColor }}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Usage Analytics */}
      <div className="rounded-2xl border p-6 mb-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '250ms' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Your Activity
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{state.flashcardProgress.length}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Cards Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{state.scenarioAttempts.length}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{state.urlAnalyses.length + state.messageAnalyses.length}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Investigations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{state.incidents.length}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Incidents</div>
          </div>
        </div>
        {/* Simple bar chart */}
        {state.activity.length > 0 && (
          <div className="mt-4">
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Recent Activity</div>
            <div className="flex items-end gap-1 h-16">
              {state.activity.slice(0, 14).reverse().map((act, i) => (
                <div key={act.id} className="flex-1 rounded-t transition-all" style={{ height: `${30 + (i * 5)}%`, background: 'var(--accent)', opacity: 0.3 + (i * 0.05) }} title={act.description} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
        {[
          { label: 'Safety Center', icon: '🛡', path: '/safety-center' },
          { label: 'Analyze URL', icon: '◎', path: '/scan?tab=url' },
          { label: 'Scam Arena', icon: '⚔', path: '/learn?section=arena' },
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

      {/* Daily Micro-Drill */}
      <div className="rounded-2xl border p-6 mb-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            Daily Micro-Drill
          </div>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            30 seconds
          </span>
        </div>
        <DailyDrill />
      </div>

      {/* Mistake Patterns */}
      {state.flashcardProgress.filter(f => !f.known).length > 0 && (
        <div className="rounded-2xl border p-6 mb-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '350ms' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
            Mistake Patterns
          </div>
          <MistakePatterns />
        </div>
      )}

      {/* Recent Activity */}
      {state.activity.length > 0 && (
        <div className="mt-6 rounded-2xl border p-6 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: '400ms' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
            Recent Activity
          </div>
          <div className="space-y-2">
            {state.activity.slice(0, 5).map(act => (
              <div key={act.id} className="flex items-center gap-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                <span className="flex-1 text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{act.description}</span>
                <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Daily Micro-Drill Component
function DailyDrill() {
  const { state, dispatch } = useStore();
  const [drillDone, setDrillDone] = useState(false);
  const [currentDrill, setCurrentDrill] = useState(0);
  
  const drills = [
    { q: 'A message says "Your account will be blocked in 10 minutes!" What\'s the red flag?', a: 'Urgency pressure', options: ['Urgency pressure', 'Bad grammar', 'Long message'] },
    { q: 'You receive an OTP you didn\'t request. What should you do?', a: 'Change password immediately', options: ['Ignore it', 'Change password immediately', 'Share it with support'] },
    { q: 'A QR code on a parking meter looks suspicious. What do you do?', a: 'Use official app instead', options: ['Scan anyway', 'Use official app instead', 'Take a photo'] },
    { q: 'Someone calls claiming to be from your bank. What\'s safest?', a: 'Hang up and call official number', options: ['Give account details', 'Hang up and call official number', 'Ask for their ID'] },
    { q: 'An app requests SMS and Accessibility permissions. What\'s the risk?', a: 'Can read OTPs and control screen', options: ['No risk', 'Can read OTPs and control screen', 'Slows down phone'] },
  ];

  const drill = drills[currentDrill];

  const handleAnswer = (answer: string) => {
    if (answer === drill.a) {
      addActivity(dispatch, 'drill', `Correct: ${drill.q.slice(0, 30)}...`);
    } else {
      addActivity(dispatch, 'drill', `Practiced: ${drill.q.slice(0, 30)}...`);
    }
    setDrillDone(true);
  };

  if (drillDone) {
    return (
      <div className="text-center py-4">
        <div className="text-2xl mb-2">✓</div>
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Drill Complete!</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Come back tomorrow for another quick practice.</div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{drill.q}</p>
      <div className="space-y-2">
        {drill.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="w-full text-left p-3 rounded-lg border text-sm transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// Mistake Patterns Component
function MistakePatterns() {
  const { state } = useStore();
  const missedCards = state.flashcardProgress.filter(f => !f.known);
  
  // Count mistakes by category
  const categoryMistakes: Record<string, number> = {};
  missedCards.forEach(card => {
    categoryMistakes[card.category] = (categoryMistakes[card.category] || 0) + 1;
  });
  
  const sortedMistakes = Object.entries(categoryMistakes).sort((a, b) => b[1] - a[1]);
  
  if (sortedMistakes.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {sortedMistakes.slice(0, 3).map(([category, count]) => {
        const categoryInfo = [
          { key: 'phishing', label: 'Phishing', icon: '◈' },
          { key: 'passwords', label: 'Password Security', icon: '🔑' },
          { key: 'otp', label: 'OTP Scams', icon: '◎' },
          { key: 'digital-arrest', label: 'Digital Arrest', icon: '⚖' },
          { key: 'apps', label: 'Malicious Apps', icon: '◉' },
          { key: 'social-engineering', label: 'Social Engineering', icon: '◐' },
          { key: 'banking', label: 'Banking Scams', icon: '⊕' },
          { key: 'privacy', label: 'Privacy', icon: '◑' },
          { key: 'account-takeover', label: 'Account Takeover', icon: '⊘' },
          { key: 'qr-scams', label: 'QR Scams', icon: '⊞' },
          { key: 'investment', label: 'Investment Scams', icon: '⊛' },
          { key: 'job', label: 'Job Scams', icon: '⊡' },
          { key: 'response', label: 'Incident Response', icon: '⚡' },
        ].find(c => c.key === category);
        
        return (
          <div key={category} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
            <span className="text-lg">{categoryInfo?.icon || '•'}</span>
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{categoryInfo?.label || category}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{count} missed card{count > 1 ? 's' : ''}</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,184,77,0.1)', color: 'var(--warning)' }}>
              Review
            </span>
          </div>
        );
      })}
    </div>
  );
}
