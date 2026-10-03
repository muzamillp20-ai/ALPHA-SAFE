import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, addActivity } from '../store';

// Flashcard Data
const FLASHCARDS = [
  { id: 'ph1', category: 'phishing', q: 'A message says your bank account will be blocked in 10 minutes. What is the strongest red flag?', a: 'URGENT PRESSURE — Scammers use time pressure to prevent careful thinking. Legitimate banks never demand immediate action via message.' },
  { id: 'ph2', category: 'phishing', q: 'You receive an email from "support@g00gle.com". What should you check?', a: 'DOMAIN SPELLING — The domain uses "g00gle" (zeros instead of O\'s). This is a lookalike/homograph attack.' },
  { id: 'ph3', category: 'phishing', q: 'A link uses bit.ly/xyz123. Why is this suspicious?', a: 'URL SHORTENER — The actual destination is hidden. You cannot verify where the link leads before clicking.' },
  { id: 'ph4', category: 'phishing', q: 'An email asks you to "verify your account" by clicking a link. What\'s wrong?', a: 'CREDENTIAL REQUEST via link — Legitimate services ask you to log in through their official app/website, not through email links.' },
  { id: 'ph5', category: 'phishing', q: 'You see a URL like http://login.bank.com.secure-site.xyz. What\'s suspicious?', a: 'SUBDOMAIN TRICK — The actual domain is "secure-site.xyz", not "bank.com". The subdomain is designed to look trustworthy.' },
  { id: 'sc1', category: 'scams', q: 'Someone calls claiming to be from the "cyber crime department" and says you\'re under investigation. What type of scam is this?', a: 'DIGITAL ARREST SCAM — Police/cyber crime departments NEVER call to arrest or threaten. This is a well-known fraud.' },
  { id: 'sc2', category: 'scams', q: 'A "delivery company" asks for a small fee to release a package. What\'s the red flag?', a: 'FAKE DELIVERY SCAM — Legitimate delivery companies don\'t ask for payment via message. Check tracking on the official website.' },
  { id: 'sc3', category: 'scams', q: 'You receive a job offer with very high pay for minimal work. What should you suspect?', a: 'JOB SCAM — If it sounds too good to be true, it probably is. Scammers lure victims with unrealistic salary promises.' },
  { id: 'sc4', category: 'scams', q: 'Someone promises guaranteed high returns on investment with no risk. What\'s the problem?', a: 'INVESTMENT SCAM — No legitimate investment guarantees high returns with zero risk. This is a classic fraud indicator.' },
  { id: 'sc5', category: 'scams', q: 'A caller asks for your OTP to "verify your identity." What should you do?', a: 'NEVER SHARE OTP — OTPs are for YOUR verification only. No legitimate organization will ask for your OTP.' },
  { id: 'app1', category: 'apps', q: 'An app requests SMS and Accessibility permissions. Why is this dangerous?', a: 'EXCESSIVE PERMISSIONS — SMS access lets the app read your messages (including OTPs). Accessibility can control your screen.' },
  { id: 'app2', category: 'apps', q: 'You downloaded an app from a website, not the official store. What\'s the risk?', a: 'UNVERIFIED SOURCE — Apps outside official stores bypass security checks and may contain malware.' },
  { id: 'app3', category: 'apps', q: 'A calculator app requests camera, contacts, and location permissions. What\'s wrong?', a: 'UNNECESSARY PERMISSIONS — A calculator has no legitimate reason for these permissions. This suggests malicious intent.' },
  { id: 'priv1', category: 'privacy', q: 'A website asks you to "Accept All Cookies." What should you consider?', a: 'PRIVACY CONTROL — You can usually customize cookie settings. Accepting all gives the site maximum tracking ability.' },
  { id: 'priv2', category: 'privacy', q: 'An app asks to access your contacts "for better experience." What should you think?', a: 'PERMISSION JUSTIFICATION — Always ask: does this app NEED my contacts? If not, deny the permission.' },
  { id: 'resp1', category: 'response', q: 'You just shared your OTP with someone. What should you do FIRST?', a: 'IMMEDIATE ACTION — Contact your bank/service provider immediately to freeze your account. Change passwords. Document everything.' },
  { id: 'resp2', category: 'response', q: 'You realize you\'ve been scammed. What\'s the first step for evidence?', a: 'SCREENSHOT EVERYTHING — Capture messages, call logs, URLs, transaction details before anything is deleted.' },
  { id: 'resp3', category: 'response', q: 'After a scam incident, who should you report to?', a: 'LOCAL CYBERCRIME AUTHORITY — File a complaint with your national cybercrime reporting portal. Keep all evidence organized.' },
];

// Scam Scenarios
const SCENARIOS = [
  {
    id: 'digital-arrest',
    category: 'scams',
    title: 'Digital Arrest Simulation',
    badge: 'EDUCATIONAL SIMULATION',
    stages: [
      { text: 'Your phone rings. An unknown number. You answer. "Hello, this is Officer Rajesh from the Cyber Crime Department. We have received a complaint against your phone number."', options: [
        { text: 'Listen and ask what the complaint is about', score: 0, flag: 'Engaging with unknown authority claims' },
        { text: 'Ask for their badge number and verify independently', score: 20, flag: null },
        { text: 'Hang up immediately', score: 15, flag: null },
      ]},
      { text: '"Your phone number has been linked to a money laundering case. We have an arrest warrant. You need to cooperate or you will be arrested within 2 hours."', options: [
        { text: 'Feel scared and ask what you need to do', score: 0, flag: 'Falling for fear tactics' },
        { text: 'Stay calm — police don\'t call to announce arrests', score: 25, flag: null },
        { text: 'Ask to speak to a supervisor', score: 5, flag: 'Still engaging with the scammer' },
      ]},
      { text: '"To prove your innocence, we need you to join a video call. Our senior officer will explain the process. Please download this app for the video call."', options: [
        { text: 'Download the app as requested', score: 0, flag: 'Installing unknown app on scammer\'s instruction' },
        { text: 'Refuse — legitimate investigations don\'t work this way', score: 25, flag: null },
        { text: 'Ask for official documentation first', score: 10, flag: 'Still somewhat engaged' },
      ]},
      { text: '"You must transfer ₹50,000 to our verification account to prove your funds are clean. This will be returned after verification. Do it now or we will freeze all your accounts."', options: [
        { text: 'Transfer the money to avoid arrest', score: 0, flag: 'Sent money to scammer' },
        { text: 'Refuse — no legitimate agency asks for money transfers', score: 30, flag: null },
        { text: 'Ask for time to arrange the money', score: 0, flag: 'Still considering compliance' },
      ]},
    ],
  },
  {
    id: 'banking-scam',
    category: 'phishing',
    title: 'Banking Scam',
    badge: 'EDUCATIONAL SIMULATION',
    stages: [
      { text: 'You receive an SMS: "ALERT: Unauthorized transaction of ₹25,000 from your account. If not done by you, call immediately: +91-XXXXXXXXXX. -Bank Support"', options: [
        { text: 'Call the number immediately', score: 0, flag: 'Calling number from suspicious SMS' },
        { text: 'Check your bank app directly for transactions', score: 25, flag: null },
        { text: 'Ignore the message', score: 10, flag: null },
      ]},
      { text: 'You call. "Welcome to Bank Security. We can see the unauthorized transaction. To block it, please share your account number and OTP sent to your phone."', options: [
        { text: 'Share account number and OTP', score: 0, flag: 'Shared credentials with caller' },
        { text: 'Hang up — banks never ask for OTP over phone', score: 30, flag: null },
        { text: 'Ask for their employee ID', score: 5, flag: 'Still engaging' },
      ]},
      { text: '"Sir/Madam, if you don\'t verify now, your account will be permanently blocked within 30 minutes. This is urgent."', options: [
        { text: 'Rush to comply before deadline', score: 0, flag: 'Falling for urgency pressure' },
        { text: 'Hang up and visit the bank branch in person', score: 30, flag: null },
        { text: 'Ask them to send an official email', score: 10, flag: null },
      ]},
    ],
  },
  {
    id: 'otp-scam',
    category: 'scams',
    title: 'OTP Scam',
    badge: 'EDUCATIONAL SIMULATION',
    stages: [
      { text: 'You receive a call: "Hi, I\'m from Amazon customer support. There\'s an issue with your recent order. I\'ll send you a verification code — please read it back to me."', options: [
        { text: 'Wait for the code and share it', score: 0, flag: 'About to share OTP' },
        { text: 'Hang up — Amazon doesn\'t call to verify via OTP', score: 25, flag: null },
        { text: 'Check the Amazon app for order status', score: 20, flag: null },
      ]},
      { text: '"The code has been sent. Please share it so I can process your refund of ₹5,000. Without this code, we cannot help you."', options: [
        { text: 'Share the OTP to get the refund', score: 0, flag: 'Shared OTP for fake refund' },
        { text: 'Refuse — never share OTP with anyone', score: 30, flag: null },
        { text: 'Ask why they need the OTP specifically', score: 5, flag: 'Engaging with the scammer' },
      ]},
    ],
  },
];

// Phishing Lab examples
const PHISHING_EXAMPLES = [
  {
    id: 'ph1',
    category: 'phishing',
    subject: 'Urgent: Your Account Has Been Compromised',
    from: 'security@g0ogle-account.com',
    body: 'Dear User,\n\nWe detected suspicious activity on your account. Your account will be suspended within 24 hours if you don\'t verify your identity.\n\nClick here to verify: http://google-account.verify-login.xyz/secure\n\nFailure to act will result in permanent account loss.\n\nRegards,\nGoogle Security Team',
    redFlags: [
      { text: 'g0ogle-account.com', reason: 'Lookalike domain — uses "g0ogle" with zero instead of "o", and adds "-account"' },
      { text: 'verify-login.xyz', reason: 'Suspicious TLD (.xyz) combined with trust keywords in subdomain' },
      { text: 'suspended within 24 hours', reason: 'Artificial urgency — legitimate services don\'t threaten immediate suspension via email' },
      { text: 'Click here to verify', reason: 'Credential harvesting via link — should verify through official app/website' },
    ],
  },
  {
    id: 'ph2',
    category: 'phishing',
    subject: 'Payment Confirmation - Invoice #4829',
    from: 'billing@amaz0n-services.net',
    body: 'Hello,\n\nThis is a confirmation of your payment of $299.99 for Amazon Prime Annual Subscription.\n\nIf you did not authorize this charge, contact our billing department immediately:\nhttp://amaz0n-services.net/billing/dispute?ref=4829\n\nYour payment details will be expired in 12 hours if not confirmed.\n\nAmazon Billing',
    redFlags: [
      { text: 'amaz0n-services.net', reason: 'Lookalike domain — "amaz0n" uses zero instead of "o", and it\'s not amazon.com' },
      { text: '$299.99', reason: 'Unexpected large charge designed to create panic' },
      { text: 'expired in 12 hours', reason: 'Time pressure to prevent rational thinking' },
      { text: 'billing/dispute link', reason: 'Link leads to fake domain — could steal payment details' },
    ],
  },
];

export default function Learn() {
  const [params] = useSearchParams();
  const section = params.get('section') || 'academy';
  const [activeSection, setActiveSection] = useState(section);

  const sections = [
    { key: 'academy', label: 'Cyber Academy' },
    { key: 'flashcards', label: 'Flashcards' },
    { key: 'arena', label: 'Scam Arena' },
    { key: 'phishing', label: 'Phishing Lab' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Learn</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Build your cyber awareness through practice.</p>
      </div>

      {/* Section Tabs */}
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
        {activeSection === 'academy' && <CyberAcademy />}
        {activeSection === 'flashcards' && <FlashcardSystem />}
        {activeSection === 'arena' && <ScamArena />}
        {activeSection === 'phishing' && <PhishingLab />}
      </div>
    </div>
  );
}

function CyberAcademy() {
  const { state } = useStore();
  const paths = [
    { key: 'phishing', label: 'Phishing Defense', cards: FLASHCARDS.filter(f => f.category === 'phishing').length },
    { key: 'scams', label: 'Scam Recognition', cards: FLASHCARDS.filter(f => f.category === 'scams').length },
    { key: 'apps', label: 'App Safety', cards: FLASHCARDS.filter(f => f.category === 'apps').length },
    { key: 'privacy', label: 'Privacy Awareness', cards: FLASHCARDS.filter(f => f.category === 'privacy').length },
    { key: 'response', label: 'Incident Response', cards: FLASHCARDS.filter(f => f.category === 'response').length },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
        Learning Paths
      </div>
      {paths.map(path => {
        const progress = state.flashcardProgress.filter(f => f.category === path.key);
        const known = progress.filter(f => f.known).length;
        const total = path.cards;
        const percent = total > 0 ? Math.round((known / total) * 100) : 0;
        return (
          <div key={path.key} className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{path.label}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{known}/{total} mastered</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: 'var(--accent)' }} />
            </div>
            {/* Path nodes */}
            <div className="flex items-center gap-1 mt-4">
              {Array.from({ length: total }).map((_, i) => {
                const card = FLASHCARDS.filter(f => f.category === path.key)[i];
                const done = progress.some(p => p.cardId === card?.id && p.known);
                return (
                  <div key={i} className="flex items-center">
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px]" style={{ borderColor: done ? 'var(--accent)' : 'var(--border)', background: done ? 'var(--accent-dim)' : 'transparent', color: done ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {done ? '✓' : i + 1}
                    </div>
                    {i < total - 1 && <div className="w-4 h-px" style={{ background: 'var(--border)' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FlashcardSystem() {
  const { state, dispatch } = useStore();
  const [currentCat, setCurrentCat] = useState('phishing');
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cards = FLASHCARDS.filter(f => f.category === currentCat);
  const card = cards[cardIndex];

  const handleResponse = (known: boolean) => {
    if (!card) return;
    dispatch({
      type: 'ADD_FLASHCARD_PROGRESS',
      payload: { cardId: card.id, category: currentCat, known, attempts: 1, lastSeen: new Date().toISOString() }
    });
    addActivity(dispatch, 'learning', `${known ? 'Knew' : 'Learned'} flashcard: ${card.q.slice(0, 40)}...`);
    setRevealed(false);
    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const categories = ['phishing', 'scams', 'apps', 'privacy', 'response'];

  return (
    <div>
      {/* Category selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setCurrentCat(cat); setCardIndex(0); setRevealed(false); }}
            className="px-4 py-2 rounded-lg text-xs font-medium capitalize border whitespace-nowrap transition-all"
            style={{
              borderColor: currentCat === cat ? 'var(--accent)' : 'var(--border)',
              background: currentCat === cat ? 'var(--accent-dim)' : 'transparent',
              color: currentCat === cat ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {card && (
        <div className="animate-fade-in">
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            CARD {cardIndex + 1} / {cards.length}
          </div>
          
          {/* Card */}
          <div className="rounded-2xl border p-8 sm:p-12 min-h-[280px] flex flex-col items-center justify-center text-center mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-lg sm:text-xl leading-relaxed max-w-lg" style={{ color: 'var(--text-primary)' }}>
              {card.q}
            </p>
            
            {!revealed && (
              <button
                onClick={() => setRevealed(true)}
                className="mt-8 px-8 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--accent)', color: 'var(--bg)' }}
              >
                Reveal Answer
              </button>
            )}

            {revealed && (
              <div className="mt-6 animate-fade-in">
                <div className="p-4 rounded-xl border mb-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {card.a}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleResponse(true)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                  >
                    ✓ I knew this
                  </button>
                  <button
                    onClick={() => handleResponse(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    ✗ I missed this
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ScamArena() {
  const { state, dispatch } = useStore();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ text: string; score: number; flag: string | null }[]>([]);

  const scenario = SCENARIOS.find(s => s.id === activeScenario);

  const handleChoice = (option: { text: string; score: number; flag: string | null }) => {
    setDecisions([...decisions, option]);
    if (scenario && stageIndex < scenario.stages.length - 1) {
      setStageIndex(stageIndex + 1);
    } else {
      // Scenario complete
      const totalScore = [...decisions, option].reduce((a, d) => a + d.score, 0);
      const maxScore = scenario!.stages.length * 30;
      const percent = Math.round((totalScore / maxScore) * 100);
      const flags = [...decisions, option].filter(d => d.flag).map(d => d.flag!);
      
      dispatch({
        type: 'ADD_SCENARIO_ATTEMPT',
        payload: {
          id: crypto.randomUUID(),
          scenarioId: scenario!.id,
          category: scenario!.category,
          decisions: [...decisions, option].map(d => d.text),
          redFlagsFound: flags,
          score: percent,
          completedAt: new Date().toISOString(),
        }
      });
      addActivity(dispatch, 'simulation', `Completed scenario: ${scenario!.title}`);
    }
  };

  const resetScenario = () => {
    setActiveScenario(null);
    setStageIndex(0);
    setDecisions([]);
  };

  // Results screen
  if (activeScenario && scenario && decisions.length >= scenario.stages.length) {
    const totalScore = decisions.reduce((a, d) => a + d.score, 0);
    const maxScore = scenario.stages.length * 30;
    const percent = Math.round((totalScore / maxScore) * 100);
    const missedFlags = decisions.filter(d => d.flag).map(d => d.flag!);

    return (
      <div className="animate-fade-in">
        <div className="rounded-2xl border p-6 sm:p-8 text-center mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Response Analysis
          </div>
          <div className="text-4xl font-bold mb-2" style={{ color: percent >= 70 ? 'var(--success)' : percent >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
            {percent}%
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {percent >= 70 ? 'Excellent response! You identified the scam correctly.' : percent >= 40 ? 'Some good decisions, but there were missed red flags.' : 'This scenario caught several tactics that deserve review.'}
          </p>
        </div>

        {missedFlags.length > 0 && (
          <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Missed Red Flags
            </div>
            <ul className="space-y-2">
              {missedFlags.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--danger)' }}>⚠</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={resetScenario}
          className="px-6 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          Back to Scenarios
        </button>
      </div>
    );
  }

  // Active scenario
  if (scenario && stageIndex < scenario.stages.length) {
    const stage = scenario.stages[stageIndex];
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            {scenario.badge}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Stage {stageIndex + 1} / {scenario.stages.length}
          </span>
        </div>

        <div className="rounded-2xl border p-6 sm:p-8 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
            {stage.text}
          </p>
          <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            What do you do?
          </div>
          <div className="space-y-2">
            {stage.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt)}
                className="w-full text-left p-4 rounded-xl border text-sm transition-all hover:border-[var(--border-light)]"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Scenario selection
  return (
    <div className="space-y-4">
      <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
        Choose a Scenario
      </div>
      {SCENARIOS.map(s => {
        const attempts = state.scenarioAttempts.filter(a => a.scenarioId === s.id);
        const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null;
        return (
          <button
            key={s.id}
            onClick={() => { setActiveScenario(s.id); setStageIndex(0); setDecisions([]); }}
            className="w-full text-left rounded-xl border p-5 transition-all hover:border-[var(--border-light)]"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.stages.length} stages</div>
              </div>
              {bestScore !== null && (
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  Best: {bestScore}%
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PhishingLab() {
  const [activeExample, setActiveExample] = useState<string | null>(null);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);

  const example = PHISHING_EXAMPLES.find(e => e.id === activeExample);

  const handleFlagClick = (flagText: string) => {
    if (!foundFlags.includes(flagText)) {
      setFoundFlags([...foundFlags, flagText]);
    }
  };

  if (example) {
    const allFound = example.redFlags.every(f => foundFlags.includes(f.text));
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            EDUCATIONAL SIMULATION
          </span>
        </div>

        {/* Simulated email */}
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>From: <span className="font-mono">{example.from}</span></div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{example.subject}</div>
          </div>
          <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {example.body}
          </div>
        </div>

        <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Click on suspicious elements you identify ({foundFlags.length}/{example.redFlags.length} found)
        </div>

        {/* Clickable red flags */}
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap gap-2">
            {example.redFlags.map(flag => (
              <button
                key={flag.text}
                onClick={() => handleFlagClick(flag.text)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={{
                  borderColor: foundFlags.includes(flag.text) ? 'var(--success)' : 'var(--border)',
                  background: foundFlags.includes(flag.text) ? 'rgba(32,211,154,0.1)' : 'var(--surface-2)',
                  color: foundFlags.includes(flag.text) ? 'var(--success)' : 'var(--text-secondary)',
                }}
              >
                {foundFlags.includes(flag.text) ? '✓ ' : ''}{flag.text}
              </button>
            ))}
          </div>
        </div>

        {/* Explanations for found flags */}
        {foundFlags.length > 0 && (
          <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
              Why These Matter
            </div>
            <div className="space-y-3">
              {example.redFlags.filter(f => foundFlags.includes(f.text)).map(flag => (
                <div key={flag.text} className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <div className="text-xs font-mono font-medium mb-1" style={{ color: 'var(--success)' }}>{flag.text}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{flag.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allFound && (
          <div className="text-center p-4 rounded-xl border" style={{ borderColor: 'var(--success)', background: 'rgba(32,211,154,0.05)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>✓ All red flags identified!</span>
          </div>
        )}

        <button
          onClick={() => { setActiveExample(null); setFoundFlags([]); }}
          className="mt-4 px-4 py-2 rounded-lg text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back to examples
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
        Identify Red Flags
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Examine each simulated message and identify the suspicious elements.
      </p>
      {PHISHING_EXAMPLES.map(ex => (
        <button
          key={ex.id}
          onClick={() => { setActiveExample(ex.id); setFoundFlags([]); }}
          className="w-full text-left rounded-xl border p-5 transition-all hover:border-[var(--border-light)]"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>From: {ex.from}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ex.subject}</div>
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{ex.redFlags.length} red flags to find</div>
        </button>
      ))}
    </div>
  );
}
