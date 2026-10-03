import { useState, useEffect, useRef } from 'react';
import { useStore, addActivity, type PracticeComplaint, type ShareToken } from '../store';
import QRCode from 'qrcode';

// Demo complaint data
const DEMO_COMPLAINT: PracticeComplaint = {
  id: 'demo-complaint-001',
  isDemo: true,
  incidentType: 'Phishing / Fake Banking Message',
  incidentDate: '2026-09-15',
  incidentTime: '10:42',
  incidentLocation: 'Online — received via SMS',
  description: 'Received a suspicious SMS claiming my bank account requires urgent verification. The message contained a link to a fake banking website designed to steal login credentials.',
  whoContacted: 'Unknown sender via SMS (phone number: +91-98XXX-XXXXX)',
  whatClaimed: 'Claimed to be from "Bank Security Department" stating my account would be blocked within 24 hours if not verified immediately.',
  whatAsked: 'Asked me to click a link and enter my account number, password, and OTP to "verify" my identity.',
  whatAfter: 'I opened the link and saw a page that looked like my bank\'s login page. I noticed the URL was suspicious (login.bank-verify.xyz instead of my bank\'s official domain). I closed the page immediately without entering any information.',
  suspectPhone: '+91-98XXX-XXXXX',
  suspectEmail: '',
  suspectWebsite: 'http://login.bank-verify.xyz/secure',
  suspectSocial: '',
  suspectOther: 'SMS sender ID: DM-BANKALRT',
  moneyInvolved: false,
  amount: '',
  paymentMethod: '',
  transactionDate: '',
  transactionRef: '',
  bankProvider: '',
  timeline: [
    { time: '10:42 AM', event: 'Message received', description: 'Suspicious SMS received claiming account verification needed' },
    { time: '10:44 AM', event: 'URL opened', description: 'Clicked the link in the message out of curiosity' },
    { time: '10:45 AM', event: 'Fake page displayed', description: 'Page appeared to mimic bank login but URL was suspicious' },
    { time: '10:46 AM', event: 'Page closed', description: 'Recognized phishing indicators and closed the page immediately' },
    { time: '11:05 AM', event: 'Evidence preserved', description: 'Took screenshots of the message and URL for complaint' },
  ],
  evidence: [
    { id: 'ev1', type: 'Screenshot', name: 'Suspicious SMS Message', description: 'Full screenshot of the received SMS', date: '15 September 2026' },
    { id: 'ev2', type: 'URL', name: 'Fake Banking URL', description: 'http://login.bank-verify.xyz/secure', date: '15 September 2026' },
    { id: 'ev3', type: 'Screenshot', name: 'Fake Login Page', description: 'Screenshot of the fake verification page before closing', date: '15 September 2026' },
  ],
  shareTokens: [],
  createdAt: '2026-09-15T11:10:00.000Z',
  updatedAt: '2026-09-15T11:10:00.000Z',
};

export default function ComplaintCenter() {
  const { state, dispatch } = useStore();
  const [view, setView] = useState<'home' | 'demo' | 'practice' | 'myComplaints' | 'review' | 'qr'>('home');
  const [activeComplaint, setActiveComplaint] = useState<PracticeComplaint | null>(null);
  const [practiceStep, setPracticeStep] = useState(1);
  const [qrToken, setQrToken] = useState<ShareToken | null>(null);

  // Practice form state
  const [formData, setFormData] = useState<Partial<PracticeComplaint>>({
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    description: '',
    whoContacted: '',
    whatClaimed: '',
    whatAsked: '',
    whatAfter: '',
    suspectPhone: '',
    suspectEmail: '',
    suspectWebsite: '',
    suspectSocial: '',
    suspectOther: '',
    moneyInvolved: false,
    amount: '',
    paymentMethod: '',
    transactionDate: '',
    transactionRef: '',
    bankProvider: '',
    timeline: [],
    evidence: [],
  });

  const handleStartPractice = () => {
    setView('practice');
    setPracticeStep(1);
    setFormData({
      incidentType: '', incidentDate: '', incidentTime: '', incidentLocation: '',
      description: '', whoContacted: '', whatClaimed: '', whatAsked: '', whatAfter: '',
      suspectPhone: '', suspectEmail: '', suspectWebsite: '', suspectSocial: '', suspectOther: '',
      moneyInvolved: false, amount: '', paymentMethod: '', transactionDate: '', transactionRef: '', bankProvider: '',
      timeline: [], evidence: [],
    });
  };

  const handleSavePractice = () => {
    const complaint: PracticeComplaint = {
      id: crypto.randomUUID(),
      isDemo: false,
      incidentType: formData.incidentType || '',
      incidentDate: formData.incidentDate || '',
      incidentTime: formData.incidentTime || '',
      incidentLocation: formData.incidentLocation || '',
      description: formData.description || '',
      whoContacted: formData.whoContacted || '',
      whatClaimed: formData.whatClaimed || '',
      whatAsked: formData.whatAsked || '',
      whatAfter: formData.whatAfter || '',
      suspectPhone: formData.suspectPhone || '',
      suspectEmail: formData.suspectEmail || '',
      suspectWebsite: formData.suspectWebsite || '',
      suspectSocial: formData.suspectSocial || '',
      suspectOther: formData.suspectOther || '',
      moneyInvolved: formData.moneyInvolved || false,
      amount: formData.amount || '',
      paymentMethod: formData.paymentMethod || '',
      transactionDate: formData.transactionDate || '',
      transactionRef: formData.transactionRef || '',
      bankProvider: formData.bankProvider || '',
      timeline: formData.timeline || [],
      evidence: formData.evidence || [],
      shareTokens: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PRACTICE_COMPLAINT', payload: complaint });
    addActivity(dispatch, 'complaint', `Created practice complaint: ${complaint.incidentType}`);
    setActiveComplaint(complaint);
    setView('review');
  };

  const handleGenerateQR = (complaint: PracticeComplaint) => {
    const token: ShareToken = {
      id: crypto.randomUUID(),
      complaintId: complaint.id,
      token: crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      revoked: false,
    };
    dispatch({ type: 'ADD_SHARE_TOKEN', payload: { complaintId: complaint.id, token } });
    addActivity(dispatch, 'qr', `Generated review QR for complaint`);
    setQrToken(token);
    setActiveComplaint(complaint);
    setView('qr');
  };

  const handleRevokeToken = (complaintId: string, tokenId: string) => {
    dispatch({ type: 'REVOKE_SHARE_TOKEN', payload: { complaintId, tokenId } });
    addActivity(dispatch, 'qr', 'Revoked review link');
    if (qrToken?.id === tokenId) setQrToken(null);
  };

  // HOME VIEW
  if (view === 'home') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pb-20 md:pb-8">
        <div className="animate-fade-in">
          {/* Hero */}
          <div className="rounded-2xl border p-8 sm:p-12 mb-8 relative overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
            <div className="relative z-10">
              <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--accent)' }}>
                COMPLAINT PRACTICE CENTER
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Prepare before you need to report.
              </h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Learn how to document a cyber incident, organize evidence, and prepare a structured complaint through a guided practice environment.
              </p>
            </div>
          </div>

          {/* 3-Step Process */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { num: '01', title: 'DOCUMENT', desc: 'Record what happened.' },
              { num: '02', title: 'ORGANIZE', desc: 'Collect relevant evidence.' },
              { num: '03', title: 'REVIEW', desc: 'Check before sharing.' },
            ].map((step, i) => (
              <div key={step.num} className="rounded-xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>{step.num}</div>
                <div className="text-xs font-medium tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{step.title}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleStartPractice}
              className="flex-1 py-4 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              START PRACTICE
            </button>
            <button
              onClick={() => { setActiveComplaint(DEMO_COMPLAINT); setView('demo'); }}
              className="flex-1 py-4 rounded-xl text-sm font-medium border transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              VIEW DEMO COMPLAINT
            </button>
            <button
              onClick={() => setView('myComplaints')}
              className="flex-1 py-4 rounded-xl text-sm font-medium border transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              MY COMPLAINTS ({state.practiceComplaints.filter(c => !c.isDemo).length})
            </button>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              How to File a Good Complaint
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Be factual', desc: 'Describe what happened without exaggeration.' },
                { title: 'Preserve evidence', desc: 'Keep screenshots, messages, URLs, and transaction records.' },
                { title: 'Record dates and times', desc: 'A timeline makes the incident easier to understand.' },
                { title: "Don't include secrets", desc: 'Never include OTPs, passwords, PINs, or CVVs.' },
              ].map(tip => (
                <div key={tip.title} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5" style={{ color: 'var(--accent)' }}>→</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tip.title}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEMO VIEW
  if (view === 'demo') {
    return (
      <div>
        <ComplaintViewer
          complaint={DEMO_COMPLAINT}
          isDemo={true}
          onBack={() => setView('home')}
          onGenerateQR={() => {}}
          showQRButton={false}
        />
        {/* Demo QR Button */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-8">
          <button
            onClick={() => {
              const demoToken: ShareToken = {
                id: 'demo-token-001',
                complaintId: DEMO_COMPLAINT.id,
                token: 'demo-qr-token-fictional-data',
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                revoked: false,
              };
              setQrToken(demoToken);
              setActiveComplaint(DEMO_COMPLAINT);
              setView('qr');
            }}
            className="w-full py-3 rounded-xl text-sm font-medium border transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-dim)' }}
          >
            VIEW DEMO VIA QR — DEMO QR / FICTIONAL DATA
          </button>
        </div>
      </div>
    );
  }

  // PRACTICE VIEW
  if (view === 'practice') {
    return (
      <PracticeForm
        step={practiceStep}
        setStep={setPracticeStep}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSavePractice}
        onBack={() => setView('home')}
      />
    );
  }

  // MY COMPLAINTS
  if (view === 'myComplaints') {
    const complaints = state.practiceComplaints.filter(c => !c.isDemo);
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto pb-20 md:pb-8">
        <button onClick={() => setView('home')} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>← Back</button>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>My Complaints</h2>
          <button onClick={handleStartPractice} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            + New
          </button>
        </div>
        {complaints.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No complaints yet. Start practicing to create your first one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="rounded-xl border p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.incidentType || 'Untitled'}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    {c.shareTokens.filter(t => !t.revoked && new Date(t.expiresAt) > new Date()).length > 0 ? 'Shared' : 'Private'}
                  </span>
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <button onClick={() => { setActiveComplaint(c); setView('review'); }} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    Review
                  </button>
                  <button onClick={() => handleGenerateQR(c)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                    Generate QR
                  </button>
                  <button onClick={() => { dispatch({ type: 'DELETE_PRACTICE_COMPLAINT', payload: c.id }); }} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: 'var(--danger)' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // REVIEW VIEW
  if (view === 'review' && activeComplaint) {
    return (
      <ComplaintViewer
        complaint={activeComplaint}
        isDemo={activeComplaint.isDemo}
        onBack={() => setView('myComplaints')}
        onGenerateQR={() => handleGenerateQR(activeComplaint)}
        showQRButton={!activeComplaint.isDemo}
      />
    );
  }

  // QR VIEW
  if (view === 'qr' && qrToken && activeComplaint) {
    return (
      <QRScreen
        complaint={activeComplaint}
        token={qrToken}
        onBack={() => setView('review')}
        onRevoke={() => handleRevokeToken(activeComplaint.id, qrToken.id)}
      />
    );
  }

  return null;
}

// Practice Form Component
function PracticeForm({ step, setStep, formData, setFormData, onSave, onBack }: {
  step: number;
  setStep: (s: number) => void;
  formData: Partial<PracticeComplaint>;
  setFormData: (d: Partial<PracticeComplaint>) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const steps = ['Incident', 'What Happened', 'Suspect Info', 'Financial', 'Evidence', 'Timeline', 'Review'];
  const [newTimelineEvent, setNewTimelineEvent] = useState({ time: '', event: '', description: '' });
  const [newEvidence, setNewEvidence] = useState({ type: 'Screenshot', name: '', description: '' });

  const addTimelineEvent = () => {
    if (!newTimelineEvent.time || !newTimelineEvent.event) return;
    setFormData({
      ...formData,
      timeline: [...(formData.timeline || []), { ...newTimelineEvent }],
    });
    setNewTimelineEvent({ time: '', event: '', description: '' });
  };

  const addEvidence = () => {
    if (!newEvidence.name) return;
    setFormData({
      ...formData,
      evidence: [...(formData.evidence || []), { id: crypto.randomUUID(), ...newEvidence, date: new Date().toLocaleDateString() }],
    });
    setNewEvidence({ type: 'Screenshot', name: '', description: '' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-20 md:pb-8">
      <button onClick={onBack} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>← Back</button>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center shrink-0">
            <button
              onClick={() => setStep(i + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all"
              style={{
                borderColor: step >= i + 1 ? 'var(--accent)' : 'var(--border)',
                background: step >= i + 1 ? 'var(--accent-dim)' : 'transparent',
                color: step >= i + 1 ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {i + 1}
            </button>
            {i < steps.length - 1 && <div className="w-4 h-px mx-0.5" style={{ background: step > i + 1 ? 'var(--accent)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Step 1: Incident */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Incident Information</h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Incident Type</label>
              <select value={formData.incidentType} onChange={e => setFormData({ ...formData, incidentType: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select type...</option>
                <option value="Phishing">Phishing</option>
                <option value="Online Fraud">Online Fraud</option>
                <option value="Digital Arrest Scam">Digital Arrest Scam</option>
                <option value="Investment Scam">Investment Scam</option>
                <option value="Identity Theft">Identity Theft</option>
                <option value="Financial Scam">Financial Scam</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Date</label>
                <input type="date" value={formData.incidentDate} onChange={e => setFormData({ ...formData, incidentDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Time</label>
                <input type="time" value={formData.incidentTime} onChange={e => setFormData({ ...formData, incidentTime: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Location</label>
              <input value={formData.incidentLocation} onChange={e => setFormData({ ...formData, incidentLocation: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="e.g., Online, via SMS, phone call..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>How did it start?</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Brief description of how the incident began..." />
            </div>
          </div>
        )}

        {/* Step 2: What Happened */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>What Happened?</h3>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Who contacted you?</label>
              <input value={formData.whoContacted} onChange={e => setFormData({ ...formData, whoContacted: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="e.g., Unknown caller, SMS from +91-XXXXX..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>What did they claim?</label>
              <textarea value={formData.whatClaimed} onChange={e => setFormData({ ...formData, whatClaimed: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="What story did they tell you?" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>What did they ask you to do?</label>
              <textarea value={formData.whatAsked} onChange={e => setFormData({ ...formData, whatAsked: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="What action were you pressured to take?" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>What happened afterward?</label>
              <textarea value={formData.whatAfter} onChange={e => setFormData({ ...formData, whatAfter: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="How did the situation resolve?" />
            </div>
          </div>
        )}

        {/* Step 3: Suspect Info */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Suspect Information</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fill in what you know. Leave blank if unknown.</p>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Phone Number</label>
              <input value={formData.suspectPhone} onChange={e => setFormData({ ...formData, suspectPhone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="+91-XXXXXXXXXX" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input value={formData.suspectEmail} onChange={e => setFormData({ ...formData, suspectEmail: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="suspect@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Website / URL</label>
              <input value={formData.suspectWebsite} onChange={e => setFormData({ ...formData, suspectWebsite: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none font-mono" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="https://suspicious-site.com" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Social Media Account</label>
              <input value={formData.suspectSocial} onChange={e => setFormData({ ...formData, suspectSocial: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="@username or profile URL" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Other Identifiers</label>
              <input value={formData.suspectOther} onChange={e => setFormData({ ...formData, suspectOther: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="UPI ID, sender ID, etc." />
            </div>
          </div>
        )}

        {/* Step 4: Financial */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Financial Information</h3>
            <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(255,184,77,0.05)', border: '1px solid var(--warning)' }}>
              <p className="text-xs" style={{ color: 'var(--warning)' }}>⚠ Never enter your password, PIN, CVV, or OTP in a complaint draft.</p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Was money involved?</label>
              <div className="flex gap-3">
                <button onClick={() => setFormData({ ...formData, moneyInvolved: true })} className="px-5 py-2 rounded-lg text-sm border transition-all" style={{ borderColor: formData.moneyInvolved ? 'var(--accent)' : 'var(--border)', background: formData.moneyInvolved ? 'var(--accent-dim)' : 'transparent', color: formData.moneyInvolved ? 'var(--accent)' : 'var(--text-muted)' }}>Yes</button>
                <button onClick={() => setFormData({ ...formData, moneyInvolved: false })} className="px-5 py-2 rounded-lg text-sm border transition-all" style={{ borderColor: !formData.moneyInvolved ? 'var(--accent)' : 'var(--border)', background: !formData.moneyInvolved ? 'var(--accent-dim)' : 'transparent', color: !formData.moneyInvolved ? 'var(--accent)' : 'var(--text-muted)' }}>No</button>
              </div>
            </div>
            {formData.moneyInvolved && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount</label>
                  <input value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="₹0.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Payment Method</label>
                  <input value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Bank transfer, UPI, etc." />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Transaction Date</label>
                  <input type="date" value={formData.transactionDate} onChange={e => setFormData({ ...formData, transactionDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Transaction Reference</label>
                  <input value={formData.transactionRef} onChange={e => setFormData({ ...formData, transactionRef: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none font-mono" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Transaction ID / UTR number" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Bank / Payment Provider</label>
                  <input value={formData.bankProvider} onChange={e => setFormData({ ...formData, bankProvider: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Bank name or payment app" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Evidence */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Evidence</h3>
            <div className="space-y-3">
              {(formData.evidence || []).map((ev, i) => (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <span className="text-xs font-mono w-6" style={{ color: 'var(--text-muted)' }}>#{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ev.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ev.type} — {ev.description}</div>
                  </div>
                  <button onClick={() => setFormData({ ...formData, evidence: (formData.evidence || []).filter(e => e.id !== ev.id) })} className="text-xs" style={{ color: 'var(--danger)' }}>Remove</button>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Add Evidence</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select value={newEvidence.type} onChange={e => setNewEvidence({ ...newEvidence, type: e.target.value })} className="px-2 py-1.5 rounded border text-xs outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <option>Screenshot</option>
                  <option>Message</option>
                  <option>URL</option>
                  <option>Document</option>
                  <option>Transaction Receipt</option>
                  <option>Note</option>
                </select>
                <input value={newEvidence.name} onChange={e => setNewEvidence({ ...newEvidence, name: e.target.value })} className="px-2 py-1.5 rounded border text-xs outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Evidence name" />
              </div>
              <input value={newEvidence.description} onChange={e => setNewEvidence({ ...newEvidence, description: e.target.value })} className="w-full px-2 py-1.5 rounded border text-xs outline-none mb-2" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Description" />
              <button onClick={addEvidence} disabled={!newEvidence.name} className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                Add Evidence
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Timeline */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Incident Timeline</h3>
            <div className="space-y-3">
              {(formData.timeline || []).map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    {i < (formData.timeline || []).length - 1 && <div className="w-px h-8" style={{ background: 'var(--border)' }} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{ev.time}</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ev.event}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ev.description}</div>
                  </div>
                  <button onClick={() => setFormData({ ...formData, timeline: (formData.timeline || []).filter((_, idx) => idx !== i) })} className="text-xs" style={{ color: 'var(--danger)' }}>✕</button>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Add Timeline Event</div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input value={newTimelineEvent.time} onChange={e => setNewTimelineEvent({ ...newTimelineEvent, time: e.target.value })} className="px-2 py-1.5 rounded border text-xs outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Time (e.g., 10:42 AM)" />
                <input value={newTimelineEvent.event} onChange={e => setNewTimelineEvent({ ...newTimelineEvent, event: e.target.value })} className="px-2 py-1.5 rounded border text-xs outline-none col-span-2" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Event" />
              </div>
              <input value={newTimelineEvent.description} onChange={e => setNewTimelineEvent({ ...newTimelineEvent, description: e.target.value })} className="w-full px-2 py-1.5 rounded border text-xs outline-none mb-2" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Description" />
              <button onClick={addTimelineEvent} disabled={!newTimelineEvent.time || !newTimelineEvent.event} className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                Add Event
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Review */}
        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Review Your Complaint</h3>
            <div className="space-y-3">
              <ReviewSection label="Incident Type" value={formData.incidentType} />
              <ReviewSection label="Date/Time" value={`${formData.incidentDate || '—'} ${formData.incidentTime || ''}`} />
              <ReviewSection label="Description" value={formData.description} />
              <ReviewSection label="Who Contacted" value={formData.whoContacted} />
              <ReviewSection label="Suspect Phone" value={formData.suspectPhone} />
              <ReviewSection label="Suspect Website" value={formData.suspectWebsite} />
              <ReviewSection label="Money Involved" value={formData.moneyInvolved ? `Yes — ${formData.amount || 'Amount not specified'}` : 'No'} />
              <ReviewSection label="Evidence Items" value={`${(formData.evidence || []).length} item(s)`} />
              <ReviewSection label="Timeline Events" value={`${(formData.timeline || []).length} event(s)`} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-4 py-2 rounded-lg text-sm border disabled:opacity-30" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Previous
          </button>
          {step < 7 ? (
            <button onClick={() => setStep(step + 1)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              Next
            </button>
          ) : (
            <button onClick={onSave} className="px-5 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              Save Complaint
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ label, value }: { label: string; value?: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
      <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{value || '—'}</div>
    </div>
  );
}

// Complaint Viewer
function ComplaintViewer({ complaint, isDemo, onBack, onGenerateQR, showQRButton }: {
  complaint: PracticeComplaint;
  isDemo: boolean;
  onBack: () => void;
  onGenerateQR: () => void;
  showQRButton: boolean;
}) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-20 md:pb-8">
      <button onClick={onBack} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>← Back</button>

      {isDemo && (
        <div className="rounded-lg p-3 mb-4 text-center" style={{ background: 'rgba(255,184,77,0.05)', border: '1px solid var(--warning)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--warning)' }}>DEMONSTRATION ONLY — NOT AN OFFICIAL COMPLAINT — ALL INFORMATION IS FICTIONAL</p>
        </div>
      )}

      {!isDemo && (
        <div className="rounded-lg p-3 mb-4 text-center" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>USER-GENERATED DRAFT — NOT AN OFFICIAL GOVERNMENT SUBMISSION</p>
        </div>
      )}

      <div className="rounded-2xl border p-6 sm:p-8 space-y-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="text-center pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--accent)' }}>ALPHA SAFE</div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Cyber Incident Complaint</h2>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Draft — {new Date(complaint.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Incident Info */}
        <section>
          <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Incident Information</div>
          <div className="space-y-2">
            <InfoRow label="Type" value={complaint.incidentType} />
            <InfoRow label="Date" value={complaint.incidentDate} />
            <InfoRow label="Time" value={complaint.incidentTime} />
            <InfoRow label="Location" value={complaint.incidentLocation} />
            <InfoRow label="Description" value={complaint.description} />
          </div>
        </section>

        {/* What Happened */}
        <section>
          <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>What Happened</div>
          <div className="space-y-2">
            <InfoRow label="Who contacted" value={complaint.whoContacted} />
            <InfoRow label="What they claimed" value={complaint.whatClaimed} />
            <InfoRow label="What they asked" value={complaint.whatAsked} />
            <InfoRow label="What happened after" value={complaint.whatAfter} />
          </div>
        </section>

        {/* Suspect Info */}
        {(complaint.suspectPhone || complaint.suspectWebsite) && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Suspect Information</div>
            <div className="space-y-2">
              {complaint.suspectPhone && <InfoRow label="Phone" value={complaint.suspectPhone} />}
              {complaint.suspectEmail && <InfoRow label="Email" value={complaint.suspectEmail} />}
              {complaint.suspectWebsite && <InfoRow label="Website" value={complaint.suspectWebsite} />}
              {complaint.suspectSocial && <InfoRow label="Social Media" value={complaint.suspectSocial} />}
              {complaint.suspectOther && <InfoRow label="Other" value={complaint.suspectOther} />}
            </div>
          </section>
        )}

        {/* Financial */}
        {complaint.moneyInvolved && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Financial Information</div>
            <div className="space-y-2">
              <InfoRow label="Amount" value={complaint.amount} />
              <InfoRow label="Payment Method" value={complaint.paymentMethod} />
              <InfoRow label="Transaction Date" value={complaint.transactionDate} />
              <InfoRow label="Reference" value={complaint.transactionRef} />
              <InfoRow label="Bank/Provider" value={complaint.bankProvider} />
            </div>
          </section>
        )}

        {/* Timeline */}
        {complaint.timeline.length > 0 && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Incident Timeline</div>
            <div className="space-y-3">
              {complaint.timeline.map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                    {i < complaint.timeline.length - 1 && <div className="w-px h-6" style={{ background: 'var(--border)' }} />}
                  </div>
                  <div>
                    <div className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{ev.time}</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ev.event}</div>
                    {ev.description && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ev.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Evidence */}
        {complaint.evidence.length > 0 && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Digital Evidence</div>
            <div className="space-y-2">
              {complaint.evidence.map((ev, i) => (
                <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{ev.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ev.type} — {ev.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Declaration */}
        <section className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Declaration</div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            I declare that the information provided above is true and correct to the best of my knowledge. This is a user-generated draft prepared for documentation purposes and is not an official government submission.
          </p>
        </section>
      </div>

      {/* Actions */}
      {showQRButton && (
        <div className="mt-6 flex gap-3">
          <button onClick={onGenerateQR} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            Generate QR for Review
          </button>
        </div>
      )}

      {/* Share tokens list */}
      {!isDemo && complaint.shareTokens.length > 0 && (
        <div className="mt-6 rounded-xl border p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Sharing Activity</div>
          <div className="space-y-2">
            {complaint.shareTokens.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                    Created: {new Date(t.createdAt).toLocaleString()}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Expires: {new Date(t.expiresAt).toLocaleString()}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded ${t.revoked ? '' : ''}`} style={{ background: t.revoked ? 'rgba(255,91,110,0.1)' : 'rgba(32,211,154,0.1)', color: t.revoked ? 'var(--danger)' : 'var(--success)' }}>
                  {t.revoked ? 'Revoked' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs shrink-0 w-24" style={{ color: 'var(--text-muted)' }}>{label}:</span>
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

// QR Code Screen
function QRScreen({ complaint, token, onBack, onRevoke }: {
  complaint: PracticeComplaint;
  token: ShareToken;
  onBack: () => void;
  onRevoke: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [qrGenerated, setQrGenerated] = useState(false);

  const reviewUrl = `${window.location.origin}${window.location.pathname}#/review/${token.token}`;

  useEffect(() => {
    if (!showPrivacy && canvasRef.current && !qrGenerated) {
      QRCode.toCanvas(canvasRef.current, reviewUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#0A0A0A', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      }).then(() => setQrGenerated(true)).catch(console.error);
    }
  }, [showPrivacy, reviewUrl, qrGenerated]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `alpha-safe-qr-${complaint.incidentType?.replace(/\s+/g, '-').toLowerCase() || 'complaint'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Alpha Safe — Complaint Review',
          text: `Review copy of complaint: ${complaint.incidentType}`,
          url: reviewUrl,
        });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(reviewUrl);
    }
  };

  if (showPrivacy) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-lg mx-auto pb-20 md:pb-8">
        <button onClick={onBack} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>← Back</button>
        <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-3xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Privacy Notice</h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            Anyone with this QR code or review link may be able to view the information included in the shared complaint until the link expires or is revoked.
          </p>
          <p className="text-xs mb-6" style={{ color: 'var(--warning)' }}>
            Do not share highly sensitive information unless necessary.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setShowPrivacy(false)} className="py-3 rounded-xl text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              I UNDERSTAND — CREATE QR
            </button>
            <button onClick={onBack} className="py-3 rounded-xl text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-lg mx-auto pb-20 md:pb-8">
      <button onClick={onBack} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>← Back</button>

      {complaint.isDemo && (
        <div className="rounded-lg p-2 mb-4 text-center" style={{ background: 'rgba(255,184,77,0.05)', border: '1px solid var(--warning)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--warning)' }}>DEMO QR — FICTIONAL DATA</p>
        </div>
      )}

      <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--accent)' }}>
          COMPLAINT REVIEW QR
        </div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {complaint.incidentType || 'Complaint'}
        </h3>
        <div className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
          Status: Ready for Review • Expires: {new Date(token.expiresAt).toLocaleString()}
        </div>

        {/* QR Code */}
        <div className="inline-block p-4 rounded-xl mb-4" style={{ background: '#FFFFFF' }}>
          <canvas ref={canvasRef} />
        </div>

        <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
          Scan this code to open a read-only review copy of this complaint.
        </p>

        <div className="flex flex-col gap-2">
          <button onClick={handleDownload} className="py-2.5 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            Download QR
          </button>
          <button onClick={handleShare} className="py-2.5 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            Share Review Link
          </button>
          <button onClick={() => { navigator.clipboard.writeText(reviewUrl); }} className="py-2.5 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Copy Review Link
          </button>
          <button onClick={onRevoke} className="py-2.5 rounded-lg text-sm" style={{ color: 'var(--danger)' }}>
            Revoke Access
          </button>
        </div>
      </div>
    </div>
  );
}
