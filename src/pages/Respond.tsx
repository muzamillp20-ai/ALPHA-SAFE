import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore, addActivity, type Incident, type EvidenceItem, type ComplaintDraft } from '../store';

export default function Respond() {
  const [params] = useSearchParams();
  const section = params.get('section') || 'emergency';
  const [activeSection, setActiveSection] = useState(section);

  const sections = [
    { key: 'emergency', label: 'Emergency' },
    { key: 'incident', label: 'Incidents' },
    { key: 'evidence', label: 'Evidence' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Respond</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Incident management and emergency response.</p>
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
        {activeSection === 'emergency' && <EmergencyResponse />}
        {activeSection === 'incident' && <IncidentWorkspace />}
        {activeSection === 'evidence' && <EvidenceVault />}
      </div>
    </div>
  );
}

function EmergencyResponse() {
  const { dispatch } = useStore();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const emergencyTypes = [
    { id: 'money', label: 'Money Sent', icon: '💸', steps: ['Contact your bank immediately to report unauthorized transaction', 'Request a freeze on your account', 'File a complaint with cybercrime portal', 'Save all transaction details as evidence'] },
    { id: 'otp', label: 'OTP Shared', icon: '🔑', steps: ['Change your account password immediately', 'Enable/change 2FA on affected accounts', 'Contact the service provider to report compromise', 'Monitor accounts for unauthorized activity'] },
    { id: 'password', label: 'Password Shared', icon: '🔒', steps: ['Change the compromised password immediately', 'Change passwords on other accounts using the same password', 'Enable two-factor authentication', 'Check for unauthorized access'] },
    { id: 'app', label: 'Malicious App Installed', icon: '📱', steps: ['Uninstall the app immediately', 'Run a security scan on your device', 'Change passwords for accounts accessed on this device', 'Check app permissions and revoke if needed'] },
    { id: 'website', label: 'Suspicious Website Opened', icon: '🌐', steps: ['Close the website immediately', 'Clear browser cache and cookies', 'Do not enter any information if you haven\'t already', 'If you entered data, change relevant passwords'] },
    { id: 'identity', label: 'Personal Info Shared', icon: '🪪', steps: ['Document what information was shared', 'Monitor for identity theft signs', 'Consider placing a fraud alert', 'File a police report if needed'] },
    { id: 'call', label: 'Scam Call', icon: '📞', steps: ['Block the number immediately', 'Do not call back', 'Document the call details (time, number, claims)', 'Report to authorities if threats were made'] },
    { id: 'message', label: 'Scam Message', icon: '💬', steps: ['Take a screenshot as evidence', 'Do not click any links in the message', 'Block the sender', 'Report as spam/phishing'] },
  ];

  const selected = emergencyTypes.find(t => t.id === selectedType);

  if (selected) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setSelectedType(null)} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          ← Back
        </button>
        <div className="rounded-2xl border p-6 sm:p-8 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selected.icon}</span>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{selected.label}</h2>
          </div>
          <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
            Immediate Steps
          </div>
          <ol className="space-y-3">
            {selected.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  {i + 1}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--warning)', background: 'rgba(255,184,77,0.05)' }}>
          <p className="text-xs" style={{ color: 'var(--warning)' }}>
            ⚠ These are general guidelines. For serious incidents, contact local law enforcement and your national cybercrime reporting authority.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--danger)' }}>⚡ I Think I've Been Scammed</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select what happened to get immediate guidance on what to do next.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emergencyTypes.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelectedType(t.id); addActivity(dispatch, 'emergency', `Viewed emergency steps for: ${t.label}`); }}
            className="p-4 rounded-xl border text-center transition-all hover:border-[var(--border-light)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <span className="text-2xl block mb-2">{t.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function IncidentWorkspace() {
  const { state, dispatch } = useStore();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [activeIncident, setActiveIncident] = useState<string | null>(null);

  const handleCreate = () => {
    if (!title.trim() || !type) return;
    const incident: Incident = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      status: 'draft',
      description: description.trim(),
      timeline: [{ id: crypto.randomUUID(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), description: 'Incident created', timestamp: new Date().toISOString() }],
      evidence: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INCIDENT', payload: incident });
    addActivity(dispatch, 'incident', `Created incident: ${title}`);
    setCreating(false);
    setTitle('');
    setType('');
    setDescription('');
  };

  const incident = state.incidents.find(i => i.id === activeIncident);

  if (incident) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => setActiveIncident(null)} className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          ← Back to incidents
        </button>
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{incident.title}</h2>
            <select
              value={incident.status}
              onChange={e => {
                const updated = { ...incident, status: e.target.value as Incident['status'], updatedAt: new Date().toISOString() };
                dispatch({ type: 'UPDATE_INCIDENT', payload: updated });
                addActivity(dispatch, 'incident', `Updated status: ${e.target.value}`);
              }}
              className="text-xs px-2 py-1 rounded border outline-none"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--accent)' }}
            >
              <option value="draft">OPEN</option>
              <option value="in-progress">IN REVIEW</option>
              <option value="completed">DOCUMENTED</option>
            </select>
          </div>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Type: {incident.type}</div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{incident.description}</div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
            Timeline
          </div>
          {incident.timeline.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No events recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {incident.timeline.map((event, i) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    {i < incident.timeline.length - 1 && <div className="w-px h-8" style={{ background: 'var(--border)' }} />}
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{event.time}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evidence */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
            Evidence ({incident.evidence.length})
          </div>
          {incident.evidence.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No evidence attached yet.</p>
          ) : (
            <div className="space-y-2">
              {incident.evidence.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                  <span className="text-sm">{ev.type === 'screenshot' ? '📷' : ev.type === 'message' ? '💬' : ev.type === 'url' ? '🔗' : '📄'}</span>
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{ev.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ev.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => { dispatch({ type: 'DELETE_INCIDENT', payload: incident.id }); setActiveIncident(null); }}
          className="mt-4 text-xs px-3 py-1.5 rounded-lg border"
          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
        >
          Delete Incident
        </button>
      </div>
    );
  }

  if (creating) {
    return (
      <div className="animate-fade-in">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>New Incident</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Brief description" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select type...</option>
                <option value="phishing">Phishing</option>
                <option value="digital-arrest">Digital Arrest Scam</option>
                <option value="banking-fraud">Banking Fraud</option>
                <option value="investment-scam">Investment Scam</option>
                <option value="job-scam">Job Scam</option>
                <option value="identity-theft">Identity Theft</option>
                <option value="otp-scam">OTP Scam</option>
                <option value="qr-scam">QR Code Scam</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="What happened..." />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} disabled={!title.trim() || !type} className="px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                Create Incident
              </button>
              <button onClick={() => setCreating(false)} className="px-5 py-2.5 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
          Your Incidents ({state.incidents.length})
        </div>
        <button onClick={() => setCreating(true)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          + New Incident
        </button>
      </div>
      {state.incidents.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No incidents recorded. Create one if you need to document a cyber incident.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.incidents.map(inc => (
            <button
              key={inc.id}
              onClick={() => setActiveIncident(inc.id)}
              className="w-full text-left rounded-xl border p-4 transition-all hover:border-[var(--border-light)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{inc.title}</div>
                <span className="text-xs capitalize px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>{inc.status}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{inc.type} • {new Date(inc.createdAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ComplaintLink() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-3xl mb-3">⊞</div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Complaint Practice Center</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Learn how to document a cyber incident, organize evidence, and prepare a structured complaint through a guided practice environment.
        </p>
        <button
          onClick={() => navigate('/complaints')}
          className="px-6 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          Open Complaint Practice Center →
        </button>
      </div>
      <div className="rounded-xl border p-4" style={{ borderColor: 'var(--warning)', background: 'rgba(255,184,77,0.05)' }}>
        <p className="text-xs" style={{ color: 'var(--warning)' }}>
          ⚠ This is an educational practice environment. It is NOT an official government complaint submission system.
        </p>
      </div>
    </div>
  );
}

// Legacy — kept for backward compatibility with old complaints
function _LegacyComplaintBuilder() {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    incidentType: '',
    details: '',
    suspectedInfo: '',
    financialInfo: '',
    evidenceNotes: '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const complaint: ComplaintDraft = {
      id: crypto.randomUUID(),
      incidentId: '',
      step,
      incidentType: formData.incidentType,
      details: formData.details,
      suspectedInfo: formData.suspectedInfo,
      financialInfo: formData.financialInfo,
      evidence: formData.evidenceNotes ? [formData.evidenceNotes] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMPLAINT', payload: complaint });
    addActivity(dispatch, 'complaint', 'Saved complaint draft');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = () => {
    const content = `
COMPLAINT DRAFT — ALPHA SAFE
============================
USER-GENERATED DRAFT — NOT AN OFFICIAL GOVERNMENT SUBMISSION

Date: ${new Date().toLocaleDateString()}

INCIDENT TYPE: ${formData.incidentType}

DETAILS:
${formData.details}

SUSPECTED INFORMATION:
${formData.suspectedInfo}

FINANCIAL INFORMATION:
${formData.financialInfo}

EVIDENCE NOTES:
${formData.evidenceNotes}

============================
Generated by Alpha Safe — Personal Cyber Safety Intelligence
This is a user-generated draft. Please submit through official channels.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alpha-safe-complaint-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addActivity(dispatch, 'complaint', 'Exported complaint draft');
  };

  const steps = ['Incident', 'Details', 'Suspected Info', 'Financial', 'Evidence', 'Review'];

  const navigate = useNavigate();

  return (
    <div>
      <div className="rounded-xl border p-3 mb-4 text-center" style={{ borderColor: 'var(--warning)', background: 'rgba(255,184,77,0.05)' }}>
        <p className="text-xs" style={{ color: 'var(--warning)' }}>
          ⚠ USER-GENERATED DRAFT — NOT AN OFFICIAL GOVERNMENT SUBMISSION
        </p>
      </div>

      {/* Link to Complaint Practice Center */}
      <div className="rounded-xl border p-4 mb-6 flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Complaint Practice Center</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Learn, practice, and generate QR review copies</div>
        </div>
        <button onClick={() => navigate('/complaints')} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
          Open →
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
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
            {i < steps.length - 1 && <div className="w-6 h-px mx-1" style={{ background: step > i + 1 ? 'var(--accent)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {step === 1 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Incident Type</h3>
            <select value={formData.incidentType} onChange={e => setFormData({ ...formData, incidentType: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select type...</option>
              <option value="Phishing">Phishing</option>
              <option value="Online Fraud">Online Fraud</option>
              <option value="Identity Theft">Identity Theft</option>
              <option value="Financial Scam">Financial Scam</option>
              <option value="Digital Arrest Scam">Digital Arrest Scam</option>
              <option value="Investment Scam">Investment Scam</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Incident Details</h3>
            <textarea value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} rows={6} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Describe what happened in detail..." />
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Suspected Information</h3>
            <textarea value={formData.suspectedInfo} onChange={e => setFormData({ ...formData, suspectedInfo: e.target.value })} rows={5} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Any information about the suspect (phone numbers, emails, names, websites)..." />
          </div>
        )}
        {step === 4 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Financial Information</h3>
            <textarea value={formData.financialInfo} onChange={e => setFormData({ ...formData, financialInfo: e.target.value })} rows={5} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Transaction details, amounts, account numbers involved..." />
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>⚠ Do NOT enter OTPs, CVVs, or banking passwords.</p>
          </div>
        )}
        {step === 5 && (
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Evidence Notes</h3>
            <textarea value={formData.evidenceNotes} onChange={e => setFormData({ ...formData, evidenceNotes: e.target.value })} rows={5} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="List your evidence: screenshots, messages, URLs, transaction IDs..." />
          </div>
        )}
        {step === 6 && (
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Review Your Complaint</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Type</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{formData.incidentType || '—'}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Details</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{formData.details || '—'}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Suspected Info</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{formData.suspectedInfo || '—'}</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Financial</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{formData.financialInfo || '—'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg text-sm border disabled:opacity-30"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              {saved ? '✓ Saved' : 'Save Draft'}
            </button>
            {step < 6 ? (
              <button onClick={() => setStep(step + 1)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                Next
              </button>
            ) : (
              <button onClick={handleExport} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                Export Document
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Demo Complaint */}
      <div className="mt-6 rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium tracking-wider uppercase mb-1" style={{ color: 'var(--text-muted)' }}>DEMO COMPLAINT</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Open Demo Incident</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Fictional phishing complaint for learning purposes</div>
          </div>
          <button onClick={() => navigate('/complaints')} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            View Demo →
          </button>
        </div>
      </div>

      {/* Saved complaints */}
      {state.complaints.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            Saved Drafts ({state.complaints.length})
          </div>
          {state.complaints.map(c => (
            <div key={c.id} className="rounded-xl border p-4 mb-2" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{c.incidentType || 'Untitled'}</span>
                <button onClick={() => dispatch({ type: 'DELETE_COMPLAINT', payload: c.id })} className="text-xs" style={{ color: 'var(--danger)' }}>Delete</button>
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceVault() {
  const { state, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [newEvidence, setNewEvidence] = useState<Partial<EvidenceItem>>({ type: 'note', name: '', description: '', content: '' });

  const handleAdd = () => {
    if (!newEvidence.name?.trim()) return;
    const evidence: EvidenceItem = {
      id: crypto.randomUUID(),
      type: (newEvidence.type as EvidenceItem['type']) || 'note',
      name: newEvidence.name.trim(),
      description: newEvidence.description || '',
      content: newEvidence.content || '',
      createdAt: new Date().toISOString(),
    };
    // Add to first incident or create standalone
    if (state.incidents.length > 0) {
      const inc = { ...state.incidents[0], evidence: [...state.incidents[0].evidence, evidence], updatedAt: new Date().toISOString() };
      dispatch({ type: 'UPDATE_INCIDENT', payload: inc });
    }
    addActivity(dispatch, 'evidence', `Added evidence: ${evidence.name}`);
    setAdding(false);
    setNewEvidence({ type: 'note', name: '', description: '', content: '' });
  };

  // Collect all evidence from incidents
  const allEvidence = state.incidents.flatMap(inc => inc.evidence);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
          Evidence Vault ({allEvidence.length})
        </div>
        <button onClick={() => setAdding(!adding)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          + Add Evidence
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl border p-6 mb-6 animate-fade-in" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={newEvidence.type} onChange={e => setNewEvidence({ ...newEvidence, type: e.target.value as EvidenceItem['type'] })} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option value="note">Note</option>
                <option value="message">Message</option>
                <option value="url">URL</option>
                <option value="screenshot">Screenshot (description)</option>
                <option value="document">Document</option>
                <option value="transaction">Transaction</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Name</label>
              <input value={newEvidence.name} onChange={e => setNewEvidence({ ...newEvidence, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Evidence name" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Description</label>
              <input value={newEvidence.description} onChange={e => setNewEvidence({ ...newEvidence, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Brief description" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Content / Notes</label>
              <textarea value={newEvidence.content} onChange={e => setNewEvidence({ ...newEvidence, content: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} placeholder="Paste text, URLs, or details..." />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={!newEvidence.name?.trim()} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                Save Evidence
              </button>
              <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {allEvidence.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No evidence saved yet. Add evidence to document your incidents.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allEvidence.map(ev => (
            <div key={ev.id} className="rounded-xl border p-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{ev.type === 'screenshot' ? '📷' : ev.type === 'message' ? '💬' : ev.type === 'url' ? '🔗' : ev.type === 'transaction' ? '💰' : '📄'}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ev.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>{ev.type}</span>
              </div>
              {ev.description && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ev.description}</div>}
              {ev.content && <div className="text-xs mt-2 p-2 rounded font-mono" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>{ev.content}</div>}
              <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{new Date(ev.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
