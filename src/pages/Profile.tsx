import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, getAwarenessScore, getCategoryScore, addActivity } from '../store';

export default function Profile() {
  const [params] = useSearchParams();
  const section = params.get('section') || 'overview';
  const [activeSection, setActiveSection] = useState(section);

  const sections = [
    { key: 'overview', label: 'My Profile' },
    { key: 'health', label: 'Security Health' },
    { key: 'activity', label: 'Activity' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your cyber safety profile and settings.</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl mb-8 border w-fit overflow-x-auto" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: activeSection === s.key ? 'var(--accent)' : 'transparent',
              color: activeSection === s.key ? 'var(--bg)' : 'var(--text-muted)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeSection === 'overview' && <CyberProfile />}
        {activeSection === 'health' && <SecurityHealth />}
        {activeSection === 'activity' && <ActivityLog />}
        {activeSection === 'settings' && <Settings />}
      </div>
    </div>
  );
}

function CyberProfile() {
  const { state } = useStore();
  const overallScore = getAwarenessScore(state);

  const categories = [
    { key: 'phishing', label: 'Phishing' },
    { key: 'scams', label: 'Scams' },
    { key: 'apps', label: 'App Safety' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'response', label: 'Response' },
  ];

  const scores = categories.map(c => ({ ...c, score: getCategoryScore(state, c.key) }));
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted.filter(s => s.score > 0).length > 0 ? sorted[sorted.length - 1] : null;

  // Find most common mistake category
  const missedCards = state.flashcardProgress.filter(f => !f.known);
  const mistakeCounts: Record<string, number> = {};
  missedCards.forEach(f => { mistakeCounts[f.category] = (mistakeCounts[f.category] || 0) + 1; });
  const topMistake = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1])[0];

  // Learning stats
  const totalCards = state.flashcardProgress.length;
  const knownCards = state.flashcardProgress.filter(f => f.known).length;
  const totalScenarios = state.scenarioAttempts.length;
  const avgScenarioScore = totalScenarios > 0 ? Math.round(state.scenarioAttempts.reduce((a, s) => a + s.score, 0) / totalScenarios) : 0;

  const getConfidenceLabel = (score: number) => {
    if (score === 0) return 'Not started';
    if (score >= 80) return 'Strong';
    if (score >= 50) return 'Developing';
    return 'Needs Practice';
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          My Cyber Profile
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="100" cy="100" r="85" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(overallScore / 100) * 534} 534`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{overallScore}</span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>AWARENESS</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Flashcards completed</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{knownCards}/{totalCards}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Scenarios attempted</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{totalScenarios}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg scenario score</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{avgScenarioScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>URLs analyzed</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{state.urlAnalyses.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence by Category */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Cyber Confidence
        </div>
        <div className="space-y-3">
          {scores.map(s => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-24 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.score}%`, background: s.score >= 70 ? 'var(--success)' : s.score >= 40 ? 'var(--warning)' : 'var(--border-light)' }} />
              </div>
              <div className="w-28 text-xs text-right" style={{ color: 'var(--text-muted)' }}>
                {getConfidenceLabel(s.score)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {strongest && strongest.score > 0 && (
          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Strongest Defense</div>
            <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>{strongest.label} ({strongest.score}%)</div>
          </div>
        )}
        {weakest && weakest.score > 0 && weakest.score < 80 && (
          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Needs Practice</div>
            <div className="text-sm font-medium" style={{ color: 'var(--warning)' }}>{weakest.label} ({weakest.score}%)</div>
          </div>
        )}
        {topMistake && (
          <div className="rounded-xl border p-4 sm:col-span-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Most Common Mistake Area</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              You frequently miss {topMistake[0]} concepts ({topMistake[1]} missed cards)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SecurityHealth() {
  const { state, dispatch } = useStore();

  const items = [
    { key: 'mfa' as const, label: 'Multi-Factor Authentication', desc: 'Enable 2FA on all important accounts', icon: '🔐' },
    { key: 'passwordManager' as const, label: 'Password Manager', desc: 'Use a password manager for unique passwords', icon: '🔑' },
    { key: 'deviceUpdates' as const, label: 'Device Updates', desc: 'Keep your devices and apps updated', icon: '📱' },
    { key: 'appPermissions' as const, label: 'App Permissions Review', desc: 'Regularly review app permissions', icon: '⚙' },
    { key: 'privacySettings' as const, label: 'Privacy Settings', desc: 'Review social media and app privacy', icon: '👁' },
    { key: 'recoveryOptions' as const, label: 'Account Recovery', desc: 'Set up recovery options for all accounts', icon: '🔄' },
    { key: 'bankingAlerts' as const, label: 'Banking Alerts', desc: 'Enable transaction alerts on bank accounts', icon: '🏦' },
  ];

  const completed = Object.values(state.securityHealth).filter(Boolean).length;

  return (
    <div>
      <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            Security Health
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{completed}/7</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(completed / 7) * 100}%`, background: completed >= 5 ? 'var(--success)' : completed >= 3 ? 'var(--warning)' : 'var(--danger)' }} />
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => {
              dispatch({ type: 'UPDATE_SECURITY_HEALTH', payload: { [item.key]: !state.securityHealth[item.key] } });
              addActivity(dispatch, 'health', `${state.securityHealth[item.key] ? 'Unchecked' : 'Completed'}: ${item.label}`);
            }}
            className="w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[var(--border-light)]"
            style={{
              borderColor: state.securityHealth[item.key] ? 'var(--success)' : 'var(--border)',
              background: state.securityHealth[item.key] ? 'rgba(32,211,154,0.03)' : 'var(--surface)',
            }}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: state.securityHealth[item.key] ? 'var(--success)' : 'var(--border)' }}>
              {state.securityHealth[item.key] && <span className="text-xs" style={{ color: 'var(--success)' }}>✓</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityLog() {
  const { state } = useStore();

  return (
    <div>
      <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
        Recent Activity ({state.activity.length})
      </div>
      {state.activity.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No activity yet. Start learning and analyzing to build your history.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.activity.slice(0, 30).map(act => (
            <div key={act.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{act.description}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(act.timestamp).toLocaleString()}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded capitalize shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>{act.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Settings() {
  const { state, dispatch } = useStore();

  const modes: { key: 'dark' | 'light' | 'system'; label: string }[] = [
    { key: 'dark', label: 'Dark' },
    { key: 'light', label: 'Light' },
    { key: 'system', label: 'System' },
  ];

  const accents: { key: 'mono' | 'blue' | 'violet' | 'emerald' | 'amber' | 'crimson'; label: string; color: string }[] = [
    { key: 'mono', label: 'Monochrome', color: '#F5F5F5' },
    { key: 'blue', label: 'Electric Blue', color: '#5B7CFF' },
    { key: 'violet', label: 'Violet', color: '#8B5CF6' },
    { key: 'emerald', label: 'Emerald', color: '#20D39A' },
    { key: 'amber', label: 'Amber', color: '#FFB84D' },
    { key: 'crimson', label: 'Crimson', color: '#FF5B6E' },
  ];

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Appearance
        </div>
        
        <div className="mb-5">
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Mode</div>
          <div className="flex gap-2">
            {modes.map(m => (
              <button
                key={m.key}
                onClick={() => { dispatch({ type: 'SET_THEME', payload: { ...state.theme, mode: m.key } }); addActivity(dispatch, 'settings', `Changed mode to ${m.label}`); }}
                className="px-4 py-2 rounded-lg text-sm border transition-all"
                style={{
                  borderColor: state.theme.mode === m.key ? 'var(--accent)' : 'var(--border)',
                  background: state.theme.mode === m.key ? 'var(--accent-dim)' : 'transparent',
                  color: state.theme.mode === m.key ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Accent Color</div>
          <div className="flex flex-wrap gap-3">
            {accents.map(a => (
              <button
                key={a.key}
                onClick={() => { dispatch({ type: 'SET_THEME', payload: { ...state.theme, accent: a.key } }); addActivity(dispatch, 'settings', `Changed accent to ${a.label}`); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
                style={{
                  borderColor: state.theme.accent === a.key ? a.color : 'var(--border)',
                  background: state.theme.accent === a.key ? `${a.color}15` : 'transparent',
                }}
              >
                <div className="w-4 h-4 rounded-full" style={{ background: a.color }} />
                <span className="text-xs" style={{ color: state.theme.accent === a.key ? 'var(--text-primary)' : 'var(--text-muted)' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Account
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Name</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{state.user?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{state.user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Member since</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{state.user?.createdAt ? new Date(state.user.createdAt).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          Data
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          All data is stored locally in your browser. No data is sent to external servers.
        </p>
        <button
          onClick={() => {
            if (confirm('Clear all local data? This cannot be undone.')) {
              localStorage.removeItem('alphasafe_state');
              dispatch({ type: 'LOGOUT' });
            }
          }}
          className="px-4 py-2 rounded-lg text-sm border"
          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}
