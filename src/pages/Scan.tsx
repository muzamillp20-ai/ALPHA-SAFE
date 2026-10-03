import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, addActivity } from '../store';
import { analyzeURL, analyzeMessage, type URLAnalysisResult, type MessageAnalysisResult } from '../analyzers';
import { explainThreat } from '../ai';

type Tab = 'url' | 'message' | 'app';

export default function Scan() {
  const [params, setParams] = useSearchParams();
  const initialTab = (params.get('tab') as Tab) || 'url';
  const [tab, setTab] = useState<Tab>(initialTab);
  const { dispatch } = useStore();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'url', label: 'Link' },
    { key: 'message', label: 'Message' },
    { key: 'app', label: 'App' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pb-20 md:pb-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Alpha Scan
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          What do you want to check?
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-1 p-1 rounded-xl mb-8 border w-fit" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setParams({ tab: t.key }); }}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.key ? 'var(--accent)' : 'transparent',
              color: tab === t.key ? 'var(--bg)' : 'var(--text-muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {tab === 'url' && <URLAnalyzer dispatch={dispatch} />}
        {tab === 'message' && <MessageAnalyzer dispatch={dispatch} />}
        {tab === 'app' && <AppSafety />}
      </div>
    </div>
  );
}

function URLAnalyzer({ dispatch }: { dispatch: any }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<URLAnalysisResult | null>(null);
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    const analysis = analyzeURL(input);
    setResult(analysis);
    dispatch({ type: 'ADD_URL_ANALYSIS', payload: { id: crypto.randomUUID(), url: input, score: analysis.score, risks: analysis.risks, timestamp: new Date().toISOString() } });
    addActivity(dispatch, 'analysis', `Analyzed URL: ${input.slice(0, 50)}...`);
  };

  const levelColors: Record<string, string> = {
    safe: 'var(--success)',
    caution: 'var(--warning)',
    suspicious: 'var(--warning)',
    dangerous: 'var(--danger)',
  };

  const statusColors: Record<string, string> = {
    good: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
  };

  const parts = result ? [
    { key: 'protocol', label: 'PROTOCOL', ...result.protocol },
    { key: 'subdomain', label: 'SUBDOMAIN', ...result.subdomain },
    { key: 'domain', label: 'DOMAIN', ...result.domain },
    { key: 'path', label: 'PATH', ...result.path },
    { key: 'query', label: 'QUERY', ...result.query },
  ] : [];

  return (
    <div>
      {/* Input */}
      <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
          Paste a URL to analyze
        </label>
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://example.com/suspicious-path"
            className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none font-mono"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            className="px-6 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Score */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                Risk Assessment
              </div>
              <div className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: `${levelColors[result.level]}15`, color: levelColors[result.level] }}>
                {result.level.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${result.score}%`, background: levelColors[result.level] }} />
              </div>
              <span className="text-lg font-mono font-bold" style={{ color: levelColors[result.level] }}>{result.score}</span>
            </div>
          </div>

          {/* URL DNA */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              URL DNA
            </div>
            <div className="space-y-2">
              {parts.map((part, i) => (
                <div key={part.key}>
                  <button
                    onClick={() => setExpandedPart(expandedPart === part.key ? null : part.key)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:border-[var(--border-light)]"
                    style={{ borderColor: 'var(--border)', background: part.status !== 'good' ? `${statusColors[part.status]}08` : 'var(--surface-2)' }}
                  >
                    <div className="w-1.5 h-8 rounded-full" style={{ background: statusColors[part.status] }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium tracking-wider uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>
                        {part.label}
                      </div>
                      <div className="text-sm font-mono truncate" style={{ color: 'var(--text-primary)' }}>
                        {part.value || '—'}
                      </div>
                    </div>
                    <div className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${statusColors[part.status]}15`, color: statusColors[part.status] }}>
                      {part.status}
                    </div>
                  </button>
                  {expandedPart === part.key && (
                    <div className="ml-6 mt-1 p-3 rounded-lg text-xs space-y-1" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                      <div><span className="font-medium">What this means:</span> {part.note}</div>
                      {part.status !== 'good' && (
                        <div><span className="font-medium">Why it matters:</span> This component shows characteristics commonly associated with suspicious URLs.</div>
                      )}
                    </div>
                  )}
                  {i < parts.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-px h-3" style={{ background: 'var(--border)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          {result.risks.length > 0 && (
            <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                Detected Indicators
              </div>
              <ul className="space-y-2">
                {result.risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--warning)' }}>⚠</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explanation */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Explain This To Me
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {result.explanation}
            </p>
            <AIExplainButton context={input} type="url" />
          </div>

          {/* Safe Actions */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Your Next Safest Action
            </div>
            <ol className="space-y-2">
              {result.safeActions.map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    {i + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageAnalyzer({ dispatch }: { dispatch: any }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    const analysis = analyzeMessage(input);
    setResult(analysis);
    dispatch({ type: 'ADD_MESSAGE_ANALYSIS', payload: { id: crypto.randomUUID(), message: input, indicators: Object.fromEntries(analysis.indicators.map(i => [i.name, i.value])), score: analysis.score, timestamp: new Date().toISOString() } });
    addActivity(dispatch, 'analysis', 'Analyzed a message for scam indicators');
  };

  const levelColors: Record<string, string> = {
    safe: 'var(--success)',
    caution: 'var(--warning)',
    suspicious: 'var(--warning)',
    dangerous: 'var(--danger)',
  };

  return (
    <div>
      <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
          Paste a suspicious message
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste the message you received..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        />
        <button
          onClick={handleAnalyze}
          disabled={!input.trim()}
          className="mt-3 px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          Analyze Message
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Score */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                Scam Probability
              </div>
              <div className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: `${levelColors[result.level]}15`, color: levelColors[result.level] }}>
                {result.level.toUpperCase()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${result.score}%`, background: levelColors[result.level] }} />
              </div>
              <span className="text-lg font-mono font-bold" style={{ color: levelColors[result.level] }}>{result.score}</span>
            </div>
          </div>

          {/* Scam DNA */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Scam DNA
            </div>
            <div className="space-y-3">
              {result.indicators.map(ind => (
                <div key={ind.name} className="flex items-center gap-3">
                  <div className="w-32 text-xs font-medium shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    {ind.name}
                  </div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${ind.value}%`,
                        background: ind.value >= 50 ? 'var(--danger)' : ind.value >= 25 ? 'var(--warning)' : 'var(--border-light)',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>
                    {ind.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Explain This To Me
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {result.explanation}
            </p>
            <AIExplainButton context={input} type="message" />
          </div>

          {/* Safe Actions */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Your Next Safest Action
            </div>
            <ol className="space-y-2">
              {result.safeActions.map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    {i + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function AppSafety() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { id: 'source', label: 'Where was the app installed from?', options: ['Official store (Play Store/App Store)', 'Third-party store', 'Direct APK download', 'Unknown source'] },
    { id: 'developer', label: 'Is the developer verified/known?', options: ['Yes, well-known company', 'Somewhat known', 'Unknown developer', 'No developer info'] },
    { id: 'permissions', label: 'Does it request unusual permissions?', options: ['No, only relevant permissions', 'A few unusual ones', 'Many unusual permissions', 'Requests SMS/Accessibility/Overlay'] },
    { id: 'reviews', label: 'What about user reviews?', options: ['Many positive reviews', 'Mixed reviews', 'Few reviews', 'No reviews or suspicious reviews'] },
    { id: 'updates', label: 'How does it update?', options: ['Through official store', 'In-app auto-update', 'Manual download required', 'Unknown'] },
  ];

  const riskScores: Record<string, number> = {
    'Official store (Play Store/App Store)': 0, 'Third-party store': 15, 'Direct APK download': 30, 'Unknown source': 40,
    'Yes, well-known company': 0, 'Somewhat known': 10, 'Unknown developer': 20, 'No developer info': 30,
    'No, only relevant permissions': 0, 'A few unusual ones': 15, 'Many unusual permissions': 30, 'Requests SMS/Accessibility/Overlay': 40,
    'Many positive reviews': 0, 'Mixed reviews': 5, 'Few reviews': 10, 'No reviews or suspicious reviews': 20,
    'Through official store': 0, 'In-app auto-update': 10, 'Manual download required': 20, 'Unknown': 25,
  };

  const totalRisk = Object.values(answers).reduce((sum, val) => sum + (riskScores[val] || 0), 0);
  const maxRisk = questions.length * 40;
  const riskPercent = Math.round((totalRisk / maxRisk) * 100);

  const handleAnalyze = () => {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
  };

  const permissionExamples = [
    { name: 'Camera', risk: 'low', desc: 'Normal for camera apps' },
    { name: 'Microphone', risk: 'low', desc: 'Normal for calling apps' },
    { name: 'Contacts', risk: 'medium', desc: 'Should only access with clear reason' },
    { name: 'SMS', risk: 'high', desc: 'Can read/send messages — high risk if unnecessary' },
    { name: 'Accessibility', risk: 'high', desc: 'Can control your screen — very dangerous if misused' },
    { name: 'Overlay', risk: 'medium', desc: 'Can draw over other apps — used in clickjacking' },
  ];

  return (
    <div>
      <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
          App Safety Assessment
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Answer these questions about the app you want to evaluate.
        </p>

        <div className="space-y-5">
          {questions.map(q => (
            <div key={q.id}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{q.label}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                    className="p-2.5 rounded-lg border text-xs text-left transition-all"
                    style={{
                      borderColor: answers[q.id] === opt ? 'var(--accent)' : 'var(--border)',
                      background: answers[q.id] === opt ? 'var(--accent-dim)' : 'var(--surface-2)',
                      color: answers[q.id] === opt ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={Object.keys(answers).length < questions.length}
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          Assess Risk
        </button>
      </div>

      {submitted && (
        <div className="space-y-6 animate-slide-up">
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              App Risk Profile
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${riskPercent}%`, background: riskPercent >= 60 ? 'var(--danger)' : riskPercent >= 30 ? 'var(--warning)' : 'var(--success)' }} />
              </div>
              <span className="text-lg font-mono font-bold" style={{ color: riskPercent >= 60 ? 'var(--danger)' : riskPercent >= 30 ? 'var(--warning)' : 'var(--success)' }}>
                {riskPercent}%
              </span>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              {riskPercent >= 60 ? 'High risk — this app shows multiple concerning indicators.' : riskPercent >= 30 ? 'Moderate risk — exercise caution with this app.' : 'Low risk — no major concerns detected based on your answers.'}
            </p>
          </div>

          {/* Permission X-Ray */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Permission X-Ray — Why Permissions Matter
            </div>
            <div className="space-y-3">
              {permissionExamples.map(p => (
                <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <span className="text-sm" style={{ color: p.risk === 'high' ? 'var(--danger)' : p.risk === 'medium' ? 'var(--warning)' : 'var(--success)' }}>
                    {p.risk === 'high' ? '⚠' : p.risk === 'medium' ? '◐' : '✓'}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AI Explain Button Component
function AIExplainButton({ context, type }: { context: string; type: 'url' | 'message' }) {
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (showAI) {
      setShowAI(false);
      return;
    }
    setLoading(true);
    setShowAI(true);
    const response = await explainThreat(context, type);
    setAiResponse(response);
    setLoading(false);
  };

  return (
    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={handleAskAI}
        disabled={loading}
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all"
        style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
      >
        {loading ? '⟳' : '✦'} {loading ? 'AI is thinking...' : showAI ? 'Hide AI Analysis' : 'Ask AI Assistant'}
      </button>
      {showAI && aiResponse && (
        <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
          <div className="text-[10px] font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--accent)' }}>
            AI ANALYSIS
          </div>
          {aiResponse}
        </div>
      )}
    </div>
  );
}
