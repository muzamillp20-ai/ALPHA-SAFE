import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, addActivity } from '../store';

// ============================================================
// FLASHCARD DATABASE — 13 Categories
// ============================================================
const FLASHCARDS = [
  // PHISHING (5)
  { id: 'ph1', category: 'phishing', difficulty: 1, q: 'A message says your bank account will be blocked in 10 minutes. What is the strongest red flag?', a: 'URGENT PRESSURE — Scammers use time pressure to prevent careful thinking. Legitimate banks never demand immediate action via message.' },
  { id: 'ph2', category: 'phishing', difficulty: 1, q: 'You receive an email from "support@g00gle.com". What should you check?', a: 'DOMAIN SPELLING — The domain uses "g00gle" (zeros instead of O\'s). This is a lookalike/homograph attack.' },
  { id: 'ph3', category: 'phishing', difficulty: 2, q: 'A link uses bit.ly/xyz123. Why is this suspicious?', a: 'URL SHORTENER — The actual destination is hidden. You cannot verify where the link leads before clicking.' },
  { id: 'ph4', category: 'phishing', difficulty: 2, q: 'An email asks you to "verify your account" by clicking a link. What\'s wrong?', a: 'CREDENTIAL REQUEST via link — Legitimate services ask you to log in through their official app/website, not through email links.' },
  { id: 'ph5', category: 'phishing', difficulty: 3, q: 'You see a URL like http://login.bank.com.secure-site.xyz. What\'s suspicious?', a: 'SUBDOMAIN TRICK — The actual domain is "secure-site.xyz", not "bank.com". The subdomain is designed to look trustworthy.' },

  // PASSWORD SECURITY (4)
  { id: 'pw1', category: 'passwords', difficulty: 1, q: 'You use the same password for email and banking. What\'s the risk?', a: 'CREDENTIAL STUFFING — If one service is breached, attackers will try the same password on other services including banking.' },
  { id: 'pw2', category: 'passwords', difficulty: 1, q: 'A website asks you to "confirm your password" via email link. What should you do?', a: 'NEVER confirm passwords via email link. Go directly to the official website by typing the URL yourself.' },
  { id: 'pw3', category: 'passwords', difficulty: 2, q: 'Your browser offers to save a password. Is this safe?', a: 'BROWSER PASSWORD MANAGERS are generally safe for personal use, but dedicated password managers offer better security and cross-device sync.' },
  { id: 'pw4', category: 'passwords', difficulty: 2, q: 'How often should you change passwords?', a: 'Only change when compromised or weak. Frequent changes lead to weaker passwords. Use strong unique passwords with 2FA instead.' },

  // OTP SCAMS (4)
  { id: 'otp1', category: 'otp', difficulty: 1, q: 'Someone calls and asks for the OTP sent to your phone. What do you do?', a: 'NEVER SHARE OTP — OTPs are for YOUR verification only. No legitimate organization will ever ask for your OTP.' },
  { id: 'otp2', category: 'otp', difficulty: 1, q: 'You receive an OTP you didn\'t request. What does this mean?', a: 'Someone may be trying to access your account. Change your password immediately and enable 2FA if not already active.' },
  { id: 'otp3', category: 'otp', difficulty: 2, q: 'A "bank representative" says they sent an OTP to verify your identity. Is this legitimate?', a: 'NO — Banks send OTPs for transactions YOU initiate. They never call to ask you to read back an OTP.' },
  { id: 'otp4', category: 'otp', difficulty: 2, q: 'You accidentally shared an OTP. What should you do immediately?', a: 'Contact your bank/service provider immediately to freeze the account. Change passwords. Monitor for unauthorized transactions.' },

  // DIGITAL ARREST (4)
  { id: 'da1', category: 'digital-arrest', difficulty: 1, q: 'Someone calls claiming to be from the cyber crime police. Is this legitimate?', a: 'NO — Police/cyber crime departments NEVER call to announce arrests or investigations. This is always a scam.' },
  { id: 'da2', category: 'digital-arrest', difficulty: 1, q: 'A caller says you must join a video call to "prove your innocence." What\'s happening?', a: 'DIGITAL ARREST SCAM — No legal process works this way. They want to intimidate you into transferring money.' },
  { id: 'da3', category: 'digital-arrest', difficulty: 2, q: 'The caller shows a fake police ID on video call. Does this make it real?', a: 'NO — Anyone can display fake IDs on video. Real police never conduct investigations via video call.' },
  { id: 'da4', category: 'digital-arrest', difficulty: 2, q: 'The caller asks you to download a specific app for the "video verification." What\'s the risk?', a: 'The app likely contains malware or gives remote access to your device. Never install apps on a stranger\'s instruction.' },

  // MALICIOUS APPS (4)
  { id: 'app1', category: 'apps', difficulty: 1, q: 'An app requests SMS and Accessibility permissions. Why is this dangerous?', a: 'EXCESSIVE PERMISSIONS — SMS access lets the app read your messages (including OTPs). Accessibility can control your screen.' },
  { id: 'app2', category: 'apps', difficulty: 1, q: 'You downloaded an app from a website, not the official store. What\'s the risk?', a: 'UNVERIFIED SOURCE — Apps outside official stores bypass security checks and may contain malware.' },
  { id: 'app3', category: 'apps', difficulty: 2, q: 'A calculator app requests camera, contacts, and location permissions. What\'s wrong?', a: 'UNNECESSARY PERMISSIONS — A calculator has no legitimate reason for these permissions. This suggests malicious intent.' },
  { id: 'app4', category: 'apps', difficulty: 2, q: 'An app asks you to enable "Install from unknown sources." What should you think?', a: 'HIGH RISK — This bypasses store security. Only enable temporarily if absolutely necessary and disable immediately after.' },

  // SOCIAL ENGINEERING (4)
  { id: 'se1', category: 'social-engineering', difficulty: 1, q: 'Someone on social media befriends you and eventually asks for money. What is this?', a: 'ROMANCE/TRUST SCAM — Scammers build fake relationships over time to gain trust before requesting money.' },
  { id: 'se2', category: 'social-engineering', difficulty: 2, q: 'A "colleague" emails asking for urgent wire transfer. The email looks real. What should you verify?', a: 'VERIFY IN PERSON — Check the actual email address character by character. Call the person on a known number. Never trust urgency.' },
  { id: 'se3', category: 'social-engineering', difficulty: 2, q: 'Someone claims to be from tech support and says your computer has a virus. What\'s happening?', a: 'TECH SUPPORT SCAM — They want remote access to your computer or payment for fake services. Hang up immediately.' },
  { id: 'se4', category: 'social-engineering', difficulty: 3, q: 'A caller knows your name, bank, and last transaction. Does this make them legitimate?', a: 'NO — Scammers obtain personal data from breaches or social media. Knowledge of your info does not prove identity.' },

  // BANKING SCAMS (4)
  { id: 'bk1', category: 'banking', difficulty: 1, q: 'You receive an SMS about an unauthorized transaction with a callback number. What should you do?', a: 'DO NOT CALL THE NUMBER — Check your bank app directly. The number in the SMS may connect to scammers.' },
  { id: 'bk2', category: 'banking', difficulty: 1, q: 'Someone offers to double your money if you transfer first. What is this?', a: 'ADVANCE FEE SCAM — You will never receive the promised return. The initial transfer is the theft.' },
  { id: 'bk3', category: 'banking', difficulty: 2, q: 'A "bank manager" calls and asks you to transfer money to a "safe account." Is this real?', a: 'NEVER — Banks never ask customers to transfer money to other accounts for safety. This is always fraud.' },
  { id: 'bk4', category: 'banking', difficulty: 2, q: 'You receive a fake check and are asked to deposit it and send back part of the money. What happens?', a: 'FAKE CHECK SCAM — The check will eventually bounce, but the money you sent is gone. You lose the difference.' },

  // PRIVACY (3)
  { id: 'pr1', category: 'privacy', difficulty: 1, q: 'A website asks you to "Accept All Cookies." What should you consider?', a: 'PRIVACY CONTROL — You can usually customize cookie settings. Accepting all gives the site maximum tracking ability.' },
  { id: 'pr2', category: 'privacy', difficulty: 1, q: 'An app asks to access your contacts "for better experience." What should you think?', a: 'PERMISSION JUSTIFICATION — Always ask: does this app NEED my contacts? If not, deny the permission.' },
  { id: 'pr3', category: 'privacy', difficulty: 2, q: 'You post vacation photos while still on vacation. What\'s the risk?', a: 'BURGLARY RISK — This publicly signals your home is empty. Post after returning home instead.' },

  // ACCOUNT TAKEOVER (3)
  { id: 'at1', category: 'account-takeover', difficulty: 1, q: 'You receive a password reset email you didn\'t request. What should you do?', a: 'IMMEDIATE ACTION — Change your password immediately. Someone is trying to access your account. Enable 2FA.' },
  { id: 'at2', category: 'account-takeover', difficulty: 2, q: 'Your social media account shows posts you didn\'t make. What happened?', a: 'ACCOUNT COMPROMISED — Change password immediately, enable 2FA, review connected apps, and report to the platform.' },
  { id: 'at3', category: 'account-takeover', difficulty: 2, q: 'Someone recovered your account using security questions. How to prevent this?', a: 'Use fake answers to security questions (not real personal info). Enable 2FA as primary recovery method.' },

  // QR SCAMS (3)
  { id: 'qr1', category: 'qr-scams', difficulty: 1, q: 'A QR code on a parking meter asks you to pay via app. What should you check?', a: 'QR TAMPERING — Scammers paste fake QR codes over real ones. Verify the URL before scanning. Use official apps.' },
  { id: 'qr2', category: 'qr-scams', difficulty: 2, q: 'A restaurant QR code takes you to a strange website. What should you do?', a: 'STOP — Don\'t enter any information. The QR may have been replaced. Ask staff for the real menu/payment method.' },
  { id: 'qr3', category: 'qr-scams', difficulty: 2, q: 'Someone sends you a QR code claiming it\'s a payment receipt. What\'s the risk?', a: 'QR PHISHING — Scanning may lead to a fake login page or trigger a payment. Never scan QR codes from untrusted sources.' },

  // INVESTMENT SCAMS (3)
  { id: 'inv1', category: 'investment', difficulty: 1, q: 'Someone promises guaranteed 20% monthly returns on crypto. What\'s wrong?', a: 'IMPOSSIBLE RETURNS — No legitimate investment guarantees such high returns. This is a Ponzi/fraud scheme.' },
  { id: 'inv2', category: 'investment', difficulty: 2, q: 'An "investment advisor" adds you to a WhatsApp group showing profits. What\'s happening?', a: 'PIG BUTCHERING SCAM — Fake group members are all scammers. They build trust before stealing your investment.' },
  { id: 'inv3', category: 'investment', difficulty: 2, q: 'A trading platform shows profits but won\'t let you withdraw. What should you do?', a: 'STOP INVESTING — This is a fake platform. The "profits" are fabricated. Report to authorities. Do not pay "fees" to withdraw.' },

  // JOB SCAMS (3)
  { id: 'jb1', category: 'job', difficulty: 1, q: 'A job offer promises ₹50,000/week for 2 hours of daily work. What\'s suspicious?', a: 'TOO GOOD TO BE TRUE — Unrealistic salary for minimal work is the #1 job scam indicator.' },
  { id: 'jb2', category: 'job', difficulty: 2, q: 'A "company" asks you to pay a registration fee before starting work. What should you think?', a: 'ADVANCE FEE FRAUD — Legitimate employers never ask candidates to pay to get a job.' },
  { id: 'jb3', category: 'job', difficulty: 2, q: 'You\'re hired without an interview via email. The company has no web presence. What\'s happening?', a: 'FAKE EMPLOYER — No interview and no web presence means this is a scam designed to steal money or identity.' },

  // RESPONSE (3)
  { id: 'rp1', category: 'response', difficulty: 1, q: 'You just shared your OTP with someone. What should you do FIRST?', a: 'IMMEDIATE ACTION — Contact your bank/service provider immediately to freeze your account. Change passwords. Document everything.' },
  { id: 'rp2', category: 'response', difficulty: 1, q: 'You realize you\'ve been scammed. What\'s the first step for evidence?', a: 'SCREENSHOT EVERYTHING — Capture messages, call logs, URLs, transaction details before anything is deleted.' },
  { id: 'rp3', category: 'response', difficulty: 2, q: 'After a scam incident, who should you report to?', a: 'LOCAL CYBERCRIME AUTHORITY — File a complaint with your national cybercrime reporting portal. Keep all evidence organized.' },
];

// ============================================================
// SCAM SCENARIOS
// ============================================================
const SCENARIOS = [
  {
    id: 'digital-arrest',
    category: 'digital-arrest',
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
    category: 'banking',
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
    category: 'otp',
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
  {
    id: 'job-scam',
    category: 'job',
    title: 'Work From Home Scam',
    badge: 'EDUCATIONAL SIMULATION',
    stages: [
      { text: 'You receive a WhatsApp message: "Earn ₹5,000/day working from home! Just like and subscribe to YouTube videos. No investment needed. Reply YES to start."', options: [
        { text: 'Reply YES to learn more', score: 0, flag: 'Engaged with scam offer' },
        { text: 'Ignore and block', score: 20, flag: null },
        { text: 'Report as spam', score: 25, flag: null },
      ]},
      { text: '"Great! Here\'s your first task. Like 5 videos and send screenshot. You\'ll receive ₹500 in your account within 1 hour." You do it and actually receive ₹500.', options: [
        { text: 'Great, it\'s real! Ask for more tasks', score: 0, flag: 'Fell for trust-building phase' },
        { text: 'This seems too easy — be cautious', score: 15, flag: null },
        { text: 'Stop here — this is a known scam pattern', score: 25, flag: null },
      ]},
      { text: '"Excellent! Now join our premium task group. Pay ₹5,000 registration to unlock higher-paying tasks earning ₹20,000/day."', options: [
        { text: 'Pay the registration to earn more', score: 0, flag: 'Lost money to advance fee fraud' },
        { text: 'Refuse — never pay to earn', score: 30, flag: null },
        { text: 'Ask for company registration details', score: 5, flag: 'Still engaged' },
      ]},
    ],
  },
];

// ============================================================
// PHISHING LAB EXAMPLES
// ============================================================
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

// ============================================================
// CATEGORY DEFINITIONS
// ============================================================
const CATEGORIES = [
  { key: 'phishing', label: 'Phishing', icon: '◈', color: 'var(--danger)' },
  { key: 'passwords', label: 'Password Security', icon: '🔑', color: 'var(--warning)' },
  { key: 'otp', label: 'OTP Scams', icon: '◎', color: 'var(--danger)' },
  { key: 'digital-arrest', label: 'Digital Arrest', icon: '⚖', color: 'var(--warning)' },
  { key: 'apps', label: 'Malicious Apps', icon: '◉', color: 'var(--info)' },
  { key: 'social-engineering', label: 'Social Engineering', icon: '◐', color: 'var(--warning)' },
  { key: 'banking', label: 'Banking Scams', icon: '⊕', color: 'var(--danger)' },
  { key: 'privacy', label: 'Privacy', icon: '◑', color: 'var(--info)' },
  { key: 'account-takeover', label: 'Account Takeover', icon: '⊘', color: 'var(--danger)' },
  { key: 'qr-scams', label: 'QR Scams', icon: '⊞', color: 'var(--warning)' },
  { key: 'investment', label: 'Investment Scams', icon: '⊛', color: 'var(--danger)' },
  { key: 'job', label: 'Job Scams', icon: '⊡', color: 'var(--warning)' },
  { key: 'response', label: 'Incident Response', icon: '⚡', color: 'var(--success)' },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Learn() {
  const [params] = useSearchParams();
  const section = params.get('section') || 'academy';
  const [activeSection, setActiveSection] = useState(section);

  const sections = [
    { key: 'academy', label: 'Academy' },
    { key: 'flashcards', label: 'Flashcards' },
    { key: 'arena', label: 'Scam Arena' },
    { key: 'phishing', label: 'Phishing Lab' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Learn</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Build cyber awareness through practice and repetition.</p>
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
        {activeSection === 'academy' && <CyberAcademy onNavigate={setActiveSection} />}
        {activeSection === 'flashcards' && <FlashcardSystem />}
        {activeSection === 'arena' && <ScamArena />}
        {activeSection === 'phishing' && <PhishingLab />}
      </div>
    </div>
  );
}

// ============================================================
// CYBER ACADEMY — Learning Paths
// ============================================================
function CyberAcademy({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { state } = useStore();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-4 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
            {state.flashcardProgress.filter(f => f.known).length}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Known</div>
        </div>
        <div className="rounded-xl border p-4 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
            {state.flashcardProgress.filter(f => !f.known).length}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Needs Practice</div>
        </div>
        <div className="rounded-xl border p-4 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {FLASHCARDS.length}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Total Cards</div>
        </div>
      </div>

      {/* Review Missed Button */}
      {state.flashcardProgress.filter(f => !f.known).length > 0 && (
        <button
          onClick={() => onNavigate('flashcards')}
          className="w-full rounded-xl border p-4 flex items-center justify-between transition-all hover:border-[var(--border-light)]"
          style={{ background: 'var(--surface)', borderColor: 'var(--warning)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg" style={{ color: 'var(--warning)' }}>↺</span>
            <div className="text-left">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Review Missed Cards</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {state.flashcardProgress.filter(f => !f.known).length} cards need review
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,184,77,0.1)', color: 'var(--warning)' }}>
            Start →
          </span>
        </button>
      )}

      {/* Learning Paths */}
      <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
        Learning Paths
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map(cat => {
          const cards = FLASHCARDS.filter(f => f.category === cat.key);
          const progress = state.flashcardProgress.filter(f => f.category === cat.key);
          const known = progress.filter(f => f.known).length;
          const total = cards.length;
          const percent = total > 0 ? Math.round((known / total) * 100) : 0;
          const started = progress.length > 0;

          return (
            <button
              key={cat.key}
              onClick={() => onNavigate('flashcards')}
              className="rounded-xl border p-4 text-left transition-all hover:border-[var(--border-light)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cat.label}</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{known}/{total}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: percent === 100 ? 'var(--success)' : 'var(--accent)' }} />
              </div>
              {!started && <div className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>Not started</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// FLASHCARD SYSTEM
// ============================================================
function FlashcardSystem() {
  const { state, dispatch } = useStore();
  const [currentCat, setCurrentCat] = useState('all');
  const [mode, setMode] = useState<'all' | 'missed'>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionMissed, setSessionMissed] = useState(0);

  const cards = useMemo(() => {
    let filtered = currentCat === 'all' ? FLASHCARDS : FLASHCARDS.filter(f => f.category === currentCat);
    if (mode === 'missed') {
      const missedIds = state.flashcardProgress.filter(f => !f.known).map(f => f.cardId);
      filtered = filtered.filter(f => missedIds.includes(f.id));
    }
    return filtered;
  }, [currentCat, mode, state.flashcardProgress]);

  const card = cards[cardIndex];

  const handleResponse = (known: boolean) => {
    if (!card) return;
    dispatch({
      type: 'ADD_FLASHCARD_PROGRESS',
      payload: { cardId: card.id, category: card.category, known, attempts: 1, lastSeen: new Date().toISOString() }
    });
    addActivity(dispatch, 'learning', `${known ? 'Knew' : 'Learned'}: ${card.q.slice(0, 40)}...`);
    if (known) setSessionKnown(s => s + 1);
    else setSessionMissed(s => s + 1);
    setRevealed(false);
    if (cardIndex < cards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const resetSession = () => {
    setCardIndex(0);
    setRevealed(false);
    setSessionKnown(0);
    setSessionMissed(0);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <select
          value={currentCat}
          onChange={e => { setCurrentCat(e.target.value); resetSession(); }}
          className="px-3 py-2 rounded-lg border text-xs outline-none"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <button
          onClick={() => { setMode(mode === 'missed' ? 'all' : 'missed'); resetSession(); }}
          className="px-3 py-2 rounded-lg border text-xs font-medium transition-all"
          style={{
            borderColor: mode === 'missed' ? 'var(--warning)' : 'var(--border)',
            background: mode === 'missed' ? 'rgba(255,184,77,0.1)' : 'transparent',
            color: mode === 'missed' ? 'var(--warning)' : 'var(--text-muted)',
          }}
        >
          ↺ Review Missed
        </button>
        <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--success)' }}>✓ {sessionKnown}</span>
          <span style={{ color: 'var(--danger)' }}>✗ {sessionMissed}</span>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {mode === 'missed' ? (
            <>
              <div className="text-3xl mb-3">✓</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No missed cards!</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>You haven't missed any cards in this category yet.</p>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No cards available for this selection.</p>
          )}
        </div>
      ) : card ? (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              CARD {cardIndex + 1} / {cards.length}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= card.difficulty - 1 ? 'var(--accent)' : 'var(--border)' }} />
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border p-8 sm:p-12 min-h-[260px] flex flex-col items-center justify-center text-center mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
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
              <div className="mt-6 animate-fade-in w-full max-w-lg">
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

          {/* Progress bar */}
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${((cardIndex + 1) / cards.length) * 100}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ============================================================
// SCAM ARENA
// ============================================================
function ScamArena() {
  const { state, dispatch } = useStore();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ text: string; score: number; flag: string | null }[]>([]);

  const scenario = SCENARIOS.find(s => s.id === activeScenario);

  const handleChoice = (option: { text: string; score: number; flag: string | null }) => {
    const newDecisions = [...decisions, option];
    setDecisions(newDecisions);
    if (scenario && stageIndex < scenario.stages.length - 1) {
      setStageIndex(stageIndex + 1);
    } else {
      const totalScore = newDecisions.reduce((a, d) => a + d.score, 0);
      const maxScore = scenario!.stages.length * 30;
      const percent = Math.round((totalScore / maxScore) * 100);
      const flags = newDecisions.filter(d => d.flag).map(d => d.flag!);
      dispatch({
        type: 'ADD_SCENARIO_ATTEMPT',
        payload: {
          id: crypto.randomUUID(),
          scenarioId: scenario!.id,
          category: scenario!.category,
          decisions: newDecisions.map(d => d.text),
          redFlagsFound: flags,
          score: percent,
          completedAt: new Date().toISOString(),
        }
      });
      addActivity(dispatch, 'simulation', `Completed: ${scenario!.title}`);
    }
  };

  const resetScenario = () => {
    setActiveScenario(null);
    setStageIndex(0);
    setDecisions([]);
  };

  // Results
  if (activeScenario && scenario && decisions.length >= scenario.stages.length) {
    const totalScore = decisions.reduce((a, d) => a + d.score, 0);
    const maxScore = scenario.stages.length * 30;
    const percent = Math.round((totalScore / maxScore) * 100);
    const missedFlags = decisions.filter(d => d.flag).map(d => d.flag!);

    return (
      <div className="animate-fade-in">
        <div className="rounded-2xl border p-6 sm:p-8 text-center mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Response Analysis</div>
          <div className="text-4xl font-bold mb-2" style={{ color: percent >= 70 ? 'var(--success)' : percent >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
            {percent}%
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {percent >= 70 ? 'Excellent! You identified the scam correctly.' : percent >= 40 ? 'Some good decisions, but missed red flags.' : 'This scenario caught several tactics worth reviewing.'}
          </p>
        </div>
        {missedFlags.length > 0 && (
          <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Missed Red Flags</div>
            <ul className="space-y-2">
              {missedFlags.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--danger)' }}>⚠</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={resetScenario} className="px-6 py-2.5 rounded-xl text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
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
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>{scenario.badge}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Stage {stageIndex + 1} / {scenario.stages.length}</span>
        </div>
        <div className="rounded-2xl border p-6 sm:p-8 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>{stage.text}</p>
          <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>What do you do?</div>
          <div className="space-y-2">
            {stage.options.map((opt, i) => (
              <button key={i} onClick={() => handleChoice(opt)} className="w-full text-left p-4 rounded-xl border text-sm transition-all hover:border-[var(--border-light)]" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Selection
  return (
    <div className="space-y-4">
      <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>Choose a Scenario</div>
      {SCENARIOS.map(s => {
        const attempts = state.scenarioAttempts.filter(a => a.scenarioId === s.id);
        const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null;
        return (
          <button key={s.id} onClick={() => { setActiveScenario(s.id); setStageIndex(0); setDecisions([]); }} className="w-full text-left rounded-xl border p-5 transition-all hover:border-[var(--border-light)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.stages.length} stages • {s.category}</div>
              </div>
              {bestScore !== null && (
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>Best: {bestScore}%</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// PHISHING LAB
// ============================================================
function PhishingLab() {
  const [activeExample, setActiveExample] = useState<string | null>(null);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);

  const example = PHISHING_EXAMPLES.find(e => e.id === activeExample);

  const handleFlagClick = (flagText: string) => {
    if (!foundFlags.includes(flagText)) setFoundFlags([...foundFlags, flagText]);
  };

  if (example) {
    const allFound = example.redFlags.every(f => foundFlags.includes(f.text));
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>EDUCATIONAL SIMULATION</span>
        </div>
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>From: <span className="font-mono">{example.from}</span></div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{example.subject}</div>
          </div>
          <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{example.body}</div>
        </div>
        <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Click suspicious elements ({foundFlags.length}/{example.redFlags.length} found)
        </div>
        <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap gap-2">
            {example.redFlags.map(flag => (
              <button key={flag.text} onClick={() => handleFlagClick(flag.text)} className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all" style={{ borderColor: foundFlags.includes(flag.text) ? 'var(--success)' : 'var(--border)', background: foundFlags.includes(flag.text) ? 'rgba(32,211,154,0.1)' : 'var(--surface-2)', color: foundFlags.includes(flag.text) ? 'var(--success)' : 'var(--text-secondary)' }}>
                {foundFlags.includes(flag.text) ? '✓ ' : ''}{flag.text}
              </button>
            ))}
          </div>
        </div>
        {foundFlags.length > 0 && (
          <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Why These Matter</div>
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
        <button onClick={() => { setActiveExample(null); setFoundFlags([]); }} className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>← Back to examples</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium tracking-wider uppercase mb-4" style={{ color: 'var(--text-muted)' }}>Identify Red Flags</div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Examine each simulated message and identify the suspicious elements.</p>
      {PHISHING_EXAMPLES.map(ex => (
        <button key={ex.id} onClick={() => { setActiveExample(ex.id); setFoundFlags([]); }} className="w-full text-left rounded-xl border p-5 transition-all hover:border-[var(--border-light)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>From: {ex.from}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ex.subject}</div>
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{ex.redFlags.length} red flags to find</div>
        </button>
      ))}
    </div>
  );
}
