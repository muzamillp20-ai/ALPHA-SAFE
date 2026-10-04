import { useParams } from 'react-router-dom';
import { useStore } from '../store';
import { useState, useEffect } from 'react';

export default function ReviewPage() {
  const { token } = useParams<{ token: string }>();
  const { state } = useStore();
  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'revoked' | 'invalid'>('loading');
  const [complaint, setComplaint] = useState<any>(null);
  const [shareToken, setShareToken] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    // Handle demo token
    if (token === 'demo-qr-token-fictional-data') {
      setShareToken({
        id: 'demo-token-001',
        complaintId: 'demo-complaint-001',
        token: 'demo-qr-token-fictional-data',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        revoked: false,
      });
      setComplaint({
        id: 'demo-complaint-001',
        isDemo: true,
        incidentType: 'Phishing / Fake Banking Message',
        incidentDate: '2026-09-15',
        incidentTime: '10:42',
        incidentLocation: 'Online — received via SMS',
        description: 'Received a suspicious SMS claiming bank account requires urgent verification.',
        whoContacted: 'Unknown sender via SMS',
        whatClaimed: 'Claimed to be from Bank Security Department',
        whatAsked: 'Click link and enter credentials to verify identity',
        whatAfter: 'Recognized phishing indicators and closed page',
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
          { time: '10:42 AM', event: 'Message received', description: 'Suspicious SMS received' },
          { time: '10:44 AM', event: 'URL opened', description: 'Clicked the link' },
          { time: '10:46 AM', event: 'Page closed', description: 'Recognized phishing and closed' },
          { time: '11:05 AM', event: 'Evidence preserved', description: 'Screenshots taken' },
        ],
        evidence: [
          { id: 'ev1', type: 'Screenshot', name: 'Suspicious SMS', description: 'Full screenshot', date: '15 Sep 2026' },
          { id: 'ev2', type: 'URL', name: 'Fake URL', description: 'http://login.bank-verify.xyz', date: '15 Sep 2026' },
        ],
        shareTokens: [],
        createdAt: '2026-09-15T11:10:00.000Z',
        updatedAt: '2026-09-15T11:10:00.000Z',
      });
      setStatus('valid');
      return;
    }

    // Find the complaint with this token
    let found = false;
    for (const c of state.practiceComplaints) {
      const t = c.shareTokens.find(st => st.token === token);
      if (t) {
        setShareToken(t);
        setComplaint(c);
        found = true;

        // Check if revoked
        if (t.revoked) {
          setStatus('revoked');
        }
        // Check if expired
        else if (new Date(t.expiresAt) < new Date()) {
          setStatus('expired');
        }
        // Valid
        else {
          setStatus('valid');
        }
        break;
      }
    }

    if (!found) {
      setStatus('invalid');
    }
  }, [token, state.practiceComplaints]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (status === 'revoked') {
    return (
      <ReviewLayout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>LINK REVOKED</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            This complaint review link is no longer available.
          </p>
        </div>
      </ReviewLayout>
    );
  }

  if (status === 'expired') {
    return (
      <ReviewLayout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏰</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>LINK EXPIRED</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            This review copy is no longer available.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            The complaint owner can create a new review link if needed.
          </p>
        </div>
      </ReviewLayout>
    );
  }

  if (status === 'invalid') {
    return (
      <ReviewLayout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>REVIEW UNAVAILABLE</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            This review link is not valid or has been removed.
          </p>
        </div>
      </ReviewLayout>
    );
  }

  // Valid - show complaint
  return (
    <ReviewLayout>
      {/* Read-only badge */}
      <div className="rounded-lg p-3 mb-6 text-center" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
        <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>READ-ONLY REVIEW COPY</p>
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          Shared for review • Expires: {shareToken ? new Date(shareToken.expiresAt).toLocaleString() : '—'}
        </p>
      </div>

      <div className="rounded-2xl border p-6 sm:p-8 space-y-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="text-center pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--accent)' }}>ALPHA SAFE</div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Complaint Review</h2>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {complaint?.isDemo ? 'DEMO / EDUCATIONAL SAMPLE' : 'User-Generated Draft'}
          </div>
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
        {(complaint.whatClaimed || complaint.whatAsked) && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>What Happened</div>
            <div className="space-y-2">
              {complaint.whoContacted && <InfoRow label="Who contacted" value={complaint.whoContacted} />}
              {complaint.whatClaimed && <InfoRow label="What they claimed" value={complaint.whatClaimed} />}
              {complaint.whatAsked && <InfoRow label="What they asked" value={complaint.whatAsked} />}
              {complaint.whatAfter && <InfoRow label="What happened after" value={complaint.whatAfter} />}
            </div>
          </section>
        )}

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
              {complaint.amount && <InfoRow label="Amount" value={complaint.amount} />}
              {complaint.paymentMethod && <InfoRow label="Payment Method" value={complaint.paymentMethod} />}
              {complaint.transactionDate && <InfoRow label="Transaction Date" value={complaint.transactionDate} />}
              {complaint.transactionRef && <InfoRow label="Reference" value={complaint.transactionRef} />}
              {complaint.bankProvider && <InfoRow label="Bank/Provider" value={complaint.bankProvider} />}
            </div>
          </section>
        )}

        {/* Timeline */}
        {complaint.timeline?.length > 0 && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Incident Timeline</div>
            <div className="space-y-3">
              {complaint.timeline.map((ev: any, i: number) => (
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
        {complaint.evidence?.length > 0 && (
          <section>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Digital Evidence</div>
            <div className="space-y-2">
              {complaint.evidence.map((ev: any, i: number) => (
                <div key={ev.id || i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--surface-2)' }}>
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
            I declare that the information provided above is true and correct to the best of my knowledge. This is a user-generated draft prepared for documentation purposes.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Generated by Alpha Safe — Personal Cyber Safety Intelligence
        </p>
      </div>
    </ReviewLayout>
  );
}

function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b py-4 px-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>ALPHA</span>
            <span className="text-lg font-light" style={{ color: 'var(--text-secondary)' }}>SAFE</span>
          </div>
          <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            READ-ONLY
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
        {children}
      </main>
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
