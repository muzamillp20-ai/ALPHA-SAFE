import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAFETY_TOPICS, EMERGENCY_CONTACTS, CATEGORIES, type SafetyTopic } from '../data/safetyCenter';
import { useStore } from '../store';

export default function SafetyCenter() {
  const [selectedTopic, setSelectedTopic] = useState<SafetyTopic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const { dispatch } = useStore();

  const filteredTopics = SAFETY_TOPICS.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Emergency Section */}
      <div className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚨</span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              CYBER EMERGENCY
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <a
                key={i}
                href={contact.url || `tel:${contact.number}`}
                className="p-4 rounded-xl border transition-all hover:border-[var(--border-light)]"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{contact.name}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--danger)' }}>
                  {contact.number}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{contact.purpose}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            CYBER CRIME SAFETY CENTER
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Know the warning signs. Know the precautions. Know what to do next.
          </p>
        </div>

        {/* Emergency Help Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/respond?section=emergency')}
            className="w-full p-4 rounded-xl border-2 text-left transition-all hover:border-[var(--danger)]"
            style={{ borderColor: 'var(--danger)', background: 'rgba(255,91,110,0.05)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div className="flex-1">
                <div className="text-base font-semibold mb-1" style={{ color: 'var(--danger)' }}>
                  I THINK I'VE BEEN SCAMMED
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Get immediate help and step-by-step guidance
                </div>
              </div>
              <span className="text-xl" style={{ color: 'var(--danger)' }}>→</span>
            </div>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cybercrime types... (e.g., OTP, UPI, phishing)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: activeCategory === cat.key ? 'var(--accent)' : 'var(--surface)',
                color: activeCategory === cat.key ? 'var(--bg)' : 'var(--text-muted)',
                border: `1px solid ${activeCategory === cat.key ? 'var(--accent)' : 'var(--border)'}`
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="p-5 rounded-xl border text-left transition-all hover:border-[var(--border-light)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {topic.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  {topic.category.replace('-', ' ')}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {topic.description}
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{topic.warningSigns.length} warning signs</span>
                <span>•</span>
                <span>{topic.precautions.length} precautions</span>
              </div>
            </button>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No topics found. Try a different search or category.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 p-4 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <strong>Disclaimer:</strong> This information is for educational purposes. For official reporting, use government portals. 
            ALPHA SAFE helps you understand, prepare, and document — it does not submit official complaints.
            <br /><br />
            <strong>Last verified:</strong> January 2026 | Sources: Government of India, RBI, SEBI, CERT-In
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicDetail({ topic, onBack }: { topic: SafetyTopic; onBack: () => void }) {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [showChecklist, setShowChecklist] = useState(false);

  const handleMarkLearned = () => {
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: crypto.randomUUID(),
        type: 'learning',
        description: `Studied: ${topic.title}`,
        timestamp: new Date().toISOString()
      }
    });
    alert('Marked as learned!');
  };

  const handlePracticeScenario = () => {
    navigate('/learn?section=arena');
  };

  const handleViewFlashcards = () => {
    navigate('/learn?section=flashcards');
  };

  const handleAddToIncident = () => {
    navigate('/respond?section=incident');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back to Safety Center
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {topic.title}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {topic.description}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              {topic.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={handleMarkLearned}
            className="p-3 rounded-lg border text-sm font-medium transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            ✓ Mark as Learned
          </button>
          <button
            onClick={handlePracticeScenario}
            className="p-3 rounded-lg border text-sm font-medium transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            🎮 Practice Scenario
          </button>
          <button
            onClick={handleViewFlashcards}
            className="p-3 rounded-lg border text-sm font-medium transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            🎴 View Flashcards
          </button>
          <button
            onClick={handleAddToIncident}
            className="p-3 rounded-lg border text-sm font-medium transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            📝 Add to Incident
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="p-3 rounded-lg border text-sm font-medium transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            🔍 Investigate Now
          </button>
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="p-3 rounded-lg border text-sm font-medium transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
          >
            ✓ Safety Checklist
          </button>
        </div>

        {/* Quick Checklist */}
        {showChecklist && (
          <div className="mb-8 p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Quick Safety Checklist
            </h3>
            <div className="space-y-2">
              {topic.quickChecklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-6">
          {/* What Is It */}
          <Section title="What Is It?" icon="📖">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {topic.whatIsIt}
            </p>
          </Section>

          {/* How It Happens */}
          <Section title="How Does It Happen?" icon="⚠️">
            <div className="space-y-2">
              {topic.howItHappens.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                      {i + 1}
                    </div>
                    {i < topic.howItHappens.length - 1 && (
                      <div className="w-px h-4 my-1" style={{ background: 'var(--border)' }} />
                    )}
                  </div>
                  <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Warning Signs */}
          <Section title="Warning Signs" icon="🚩">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.warningSigns.map((sign, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <span style={{ color: 'var(--warning)' }}>⚠</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{sign}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Precautions */}
          <Section title="Precautions" icon="🛡️">
            <div className="space-y-2">
              {topic.precautions.map((precaution, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{precaution}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Never Do */}
          <Section title="Never Do This" icon="❌">
            <div className="space-y-2">
              {topic.neverDo.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,91,110,0.05)' }}>
                  <span style={{ color: 'var(--danger)' }}>❌</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* If It Happens */}
          <Section title="If It Happens To You" icon="🆘">
            <div className="space-y-2">
              {topic.ifItHappens.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--danger)', color: '#fff' }}>
                    {i + 1}
                  </div>
                  <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* First 10 Minutes */}
          <Section title="First 10 Minutes" icon="⏱️">
            <div className="space-y-2">
              {topic.firstTenMinutes.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <span className="text-xs font-mono font-bold shrink-0 w-8" style={{ color: 'var(--accent)' }}>
                    {step.split(':')[0]}
                  </span>
                  <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                    {step.split(':').slice(1).join(':').trim()}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Evidence */}
          <Section title="Evidence To Preserve" icon="📸">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.evidence.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--info)' }}>📎</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Contacts */}
          <Section title="Who To Contact" icon="📞">
            <div className="space-y-3">
              {topic.contacts.map((contact, i) => (
                <div key={i} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{contact}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Reporting */}
          <Section title="How To Report" icon="📝">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {topic.reporting}
            </p>
            <div className="mt-3 p-3 rounded-lg border" style={{ borderColor: 'var(--warning)', background: 'rgba(255,184,77,0.05)' }}>
              <p className="text-xs" style={{ color: 'var(--warning)' }}>
                <strong>Note:</strong> ALPHA SAFE helps you understand and prepare. For official complaints, use government portals like cybercrime.gov.in
              </p>
            </div>
          </Section>

          {/* Recovery */}
          <Section title="Recovery Steps" icon="🔄">
            <div className="space-y-2">
              {topic.recovery.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--success)' }}>→</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Common Mistakes */}
          <Section title="Common Mistakes" icon="⚠️">
            <div className="space-y-2">
              {topic.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,184,77,0.05)' }}>
                  <span style={{ color: 'var(--warning)' }}>❌</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{mistake}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Realistic Example */}
          <Section title="Realistic Example" icon="💡">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>EDUCATIONAL EXAMPLE • FICTIONAL SCENARIO</div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>What the user received:</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{topic.example.received}</div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>What the scammer claimed:</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{topic.example.claimed}</div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Warning signs:</div>
                  <div className="flex flex-wrap gap-1">
                    {topic.example.warningSigns.map((sign, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>What the user should do:</div>
                  <div className="space-y-1">
                    {topic.example.shouldDo.map((action, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span style={{ color: 'var(--success)' }}>✓</span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Sources */}
          <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <strong>Sources:</strong> {topic.sources.join(', ')}
              <br />
              <strong>Last verified:</strong> {topic.lastVerified}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
