// URL Analysis Engine - Deterministic, no randomness
type PartStatus = 'good' | 'warning' | 'danger';
interface URLPart { value: string; status: PartStatus; note: string; }

export interface URLAnalysisResult {
  url: string;
  score: number;
  level: 'safe' | 'caution' | 'suspicious' | 'dangerous';
  protocol: URLPart;
  hostname: URLPart;
  domain: URLPart;
  subdomain: URLPart;
  path: URLPart;
  query: URLPart;
  risks: string[];
  explanation: string;
  safeActions: string[];
}

const SUSPICIOUS_TLDS = ['xyz', 'top', 'click', 'loan', 'work', 'gq', 'cf', 'tk', 'ml', 'ga', 'buzz', 'surf', 'rest', 'icu', 'cam'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'account', 'update', 'confirm', 'banking', 'wallet', 'password', 'signin', 'signin', 'authenticate', 'suspend', 'limit', 'alert', 'notification', 'unlock', 'restore'];
const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly', 'shorturl.at', 'tiny.cc', 'bl.ink', 'cutt.ly'];
const LOOKALIKE_DOMAINS: Record<string, string> = {
  'g00gle': 'google', 'goolge': 'google', 'goog1e': 'google', 'amaz0n': 'amazon',
  'faceb00k': 'facebook', 'micr0soft': 'microsoft', 'app1e': 'apple', 'paypa1': 'paypal',
  'netfl1x': 'netflix', 'linkedln': 'linkedin', 'twltter': 'twitter', 'instagran': 'instagram'
};
const SUSPICIOUS_PORTS = [8080, 8443, 3000, 4444, 5555, 8888, 9090];
const EXECUTABLE_EXTENSIONS = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js', '.ws'];

export function analyzeURL(input: string): URLAnalysisResult {
  const risks: string[] = [];
  let score = 0;
  let url = input.trim();

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      url: input, score: 90, level: 'dangerous',
      protocol: { value: 'N/A', status: 'danger', note: 'Invalid URL format' },
      hostname: { value: input, status: 'danger', note: 'Cannot parse hostname' },
      domain: { value: '', status: 'danger', note: 'Cannot extract domain' },
      subdomain: { value: '', status: 'warning', note: 'Cannot extract subdomain' },
      path: { value: '', status: 'warning', note: 'Cannot extract path' },
      query: { value: '', status: 'warning', note: 'Cannot extract query' },
      risks: ['Invalid URL format — cannot be parsed safely'],
      explanation: 'This URL has an invalid format and cannot be analyzed. Do not visit it.',
      safeActions: ['Do not visit this URL', 'Verify the correct URL from an official source'],
    };
  }

  // Protocol analysis
  const protocol: URLPart = { value: parsed.protocol.replace(':', ''), status: 'good', note: 'Secure protocol' };
  if (parsed.protocol === 'http:') {
    protocol.status = 'warning';
    protocol.note = 'Unencrypted connection — data can be intercepted';
    risks.push('Uses HTTP instead of HTTPS');
    score += 15;
  }

  // Hostname analysis
  const hostname = parsed.hostname;
  const hostnameResult: URLPart = { value: hostname, status: 'good', note: 'Standard hostname format' };

  // IP address check
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(hostname)) {
    hostnameResult.status = 'danger';
    hostnameResult.note = 'Direct IP address — legitimate sites use domain names';
    risks.push('URL uses a raw IP address instead of a domain name');
    score += 30;
  }

  // Punycode check
  if (hostname.includes('xn--')) {
    hostnameResult.status = 'danger';
    hostnameResult.note = 'Punycode/IDN encoding detected — possible homograph attack';
    risks.push('Contains Punycode encoding (internationalized domain) — often used in homograph attacks');
    score += 25;
  }

  // Userinfo check (user:pass@domain)
  if (parsed.username || parsed.password) {
    hostnameResult.status = 'danger';
    hostnameResult.note = 'Contains embedded credentials — social engineering technique';
    risks.push('URL contains embedded username/password — this is a known phishing technique');
    score += 35;
  }

  // Port check
  if (parsed.port && SUSPICIOUS_PORTS.includes(parseInt(parsed.port))) {
    risks.push(`Uses non-standard port ${parsed.port}`);
    score += 10;
  }

  // Domain extraction
  const parts = hostname.split('.');
  let domain = '';
  let subdomain = '';
  if (parts.length >= 2) {
    domain = parts.slice(-2).join('.');
    subdomain = parts.slice(0, -2).join('.');
  }

  const domainResult: URLPart = { value: domain, status: 'good', note: 'Standard domain' };
  const subdomainResult: URLPart = { value: subdomain || 'none', status: 'good', note: 'No subdomain' };

  // Suspicious TLD
  const tld = parts[parts.length - 1];
  if (SUSPICIOUS_TLDS.includes(tld)) {
    domainResult.status = 'warning';
    domainResult.note = `TLD ".${tld}" is frequently used in phishing`;
    risks.push(`Uses suspicious top-level domain: .${tld}`);
    score += 15;
  }

  // URL shortener
  if (URL_SHORTENERS.some(s => hostname.includes(s))) {
    risks.push('URL uses a link shortener — destination is hidden');
    score += 20;
    hostnameResult.status = 'warning';
    hostnameResult.note = 'Shortened URL — actual destination is hidden';
  }

  // Lookalike domain detection
  const domainName = parts.length >= 2 ? parts[parts.length - 2] : hostname;
  for (const [fake, real] of Object.entries(LOOKALIKE_DOMAINS)) {
    if (domainName.includes(fake) || domainName === fake) {
      domainResult.status = 'danger';
      domainResult.note = `Possible impersonation of "${real}" — character substitution detected`;
      risks.push(`Domain appears to impersonate "${real}" using character substitution`);
      score += 35;
    }
  }

  // Subdomain analysis
  if (subdomain) {
    const subLower = subdomain.toLowerCase();
    // Suspicious subdomain with brand keywords
    if (SUSPICIOUS_KEYWORDS.some(kw => subLower.includes(kw))) {
      subdomainResult.status = 'warning';
      subdomainResult.note = 'Subdomain contains security-related keywords — common phishing pattern';
      risks.push('Subdomain uses trust-related keywords (login, verify, secure) to appear legitimate');
      score += 20;
    }
    // Very long subdomain
    if (subdomain.length > 30) {
      subdomainResult.status = 'warning';
      subdomainResult.note = 'Unusually long subdomain';
      risks.push('Unusually long subdomain — may be used to hide the actual domain');
      score += 10;
    }
    // Multiple dots
    if (subdomain.split('.').length > 3) {
      subdomainResult.status = 'warning';
      subdomainResult.note = 'Multiple subdomain levels — can confuse users about the real domain';
      risks.push('Deep subdomain nesting — may obscure the true destination');
      score += 10;
    }
  }

  // Path analysis
  const path = parsed.pathname;
  const pathResult: URLPart = { value: path || '/', status: 'good', note: 'Standard path' };
  const pathLower = path.toLowerCase();

  if (SUSPICIOUS_KEYWORDS.some(kw => pathLower.includes(kw))) {
    pathResult.status = 'warning';
    pathResult.note = 'Path contains security-related keywords — common in phishing pages';
    risks.push('URL path uses security-related terms that may be designed to create urgency');
    score += 10;
  }

  if (EXECUTABLE_EXTENSIONS.some(ext => pathLower.endsWith(ext))) {
    pathResult.status = 'danger';
    pathResult.note = 'Path points to an executable file — potential malware delivery';
    risks.push('URL points to an executable file — this could download malware');
    score += 30;
  }

  // Query analysis
  const query = parsed.search;
  const queryResult: URLPart = { value: query || 'none', status: 'good', note: 'No query parameters' };

  if (query) {
    const queryLower = query.toLowerCase();
    if (queryLower.includes('redirect') || queryLower.includes('return') || queryLower.includes('next') || queryLower.includes('url') || queryLower.includes('goto')) {
      queryResult.status = 'warning';
      queryResult.note = 'Contains redirect parameters — may redirect to a malicious site after appearing legitimate';
      risks.push('URL contains redirect parameters — attackers use these to chain to malicious destinations');
      score += 15;
    }
    if (queryLower.includes('token') || queryLower.includes('key') || queryLower.includes('secret') || queryLower.includes('password')) {
      queryResult.status = 'danger';
      queryResult.note = 'Query contains sensitive parameters — potential credential harvesting';
      risks.push('URL passes sensitive data in query parameters — this is insecure and suspicious');
      score += 25;
    }
    // Encoded content
    if (query.includes('%') && (query.includes('http') || query.includes('javascript'))) {
      queryResult.status = 'danger';
      queryResult.note = 'Contains encoded URLs or scripts — obfuscation technique';
      risks.push('Query contains encoded URLs or scripts — this is an obfuscation technique');
      score += 25;
    }
  }

  // Excessive length
  if (url.length > 150) {
    risks.push('URL is unusually long — long URLs can hide malicious components');
    score += 5;
  }

  // Calculate final score
  score = Math.min(100, score);
  let level: URLAnalysisResult['level'] = 'safe';
  if (score >= 60) level = 'dangerous';
  else if (score >= 35) level = 'suspicious';
  else if (score >= 15) level = 'caution';

  // Generate explanation
  let explanation = '';
  if (level === 'safe') {
    explanation = 'No obvious risk indicators were detected by this analyzer. However, always verify URLs from trusted sources before clicking.';
  } else if (level === 'caution') {
    explanation = `This URL shows ${risks.length} minor indicator(s) worth noting. While not necessarily malicious, exercise caution and verify the source.`;
  } else if (level === 'suspicious') {
    explanation = `This URL shows multiple risk indicators. The combination of ${risks.slice(0, 2).join(' and ').toLowerCase()} suggests this may not be trustworthy.`;
  } else {
    explanation = `This URL shows strong indicators of being malicious. ${risks[0]}. Do not interact with this link.`;
  }

  // Safe actions
  const safeActions: string[] = [];
  if (level === 'safe') {
    safeActions.push('Verify the source of this link before clicking.');
    safeActions.push('If unexpected, confirm with the sender through a separate channel.');
  } else if (level === 'caution') {
    safeActions.push('Do not enter any credentials on this page.');
    safeActions.push('Navigate to the official website directly instead of clicking this link.');
  } else if (level === 'suspicious') {
    safeActions.push('Do not open this link.');
    safeActions.push('Verify the intended destination through official channels.');
    safeActions.push('Report this URL if received via message or email.');
  } else {
    safeActions.push('Do not open this link under any circumstances.');
    safeActions.push('If you already opened it, do not enter any information.');
    safeActions.push('Report this as a potential phishing attempt.');
  }

  return {
    url: input, score, level, protocol, hostname: hostnameResult, domain: domainResult,
    subdomain: subdomainResult, path: pathResult, query: queryResult, risks, explanation, safeActions,
  };
}

// Message Analysis Engine
export interface MessageAnalysisResult {
  message: string;
  score: number;
  level: 'safe' | 'caution' | 'suspicious' | 'dangerous';
  indicators: { name: string; value: number; detected: string[] }[];
  explanation: string;
  safeActions: string[];
}

const URGENCY_PATTERNS = [
  /\b(immediately|urgent|now|instant|right away|hurry|asap|time.?sensitive|limited.?time|expires?|deadline|within \d+ (min|hour|day))\b/i,
  /\b(act now|don.t delay|last chance|offer ends|running out)\b/i,
  /\b(\d+ (minutes?|hours?) (to|before|remaining)|before it.s (too late|blocked|suspended|closed))\b/i,
];

const FEAR_PATTERNS = [
  /\b(blocked|suspended|terminated|frozen|locked|disabled|closed|revoked|cancelled)\b/i,
  /\b(arrest|warrant|legal action|police|case filed|fir|court order|investigation)\b/i,
  /\b(your account will be|you will be|consequences|penalty|fine|penalized)\b/i,
  /\b(compromised|breached|hacked|stolen|unauthorized)\b/i,
];

const AUTHORITY_PATTERNS = [
  /\b(bank|rbi|income tax|cyber crime|police|government|irs|hmrc|sbi|hdfc|icici)\b/i,
  /\b(department|ministry|commission|authority|agency|official|officer)\b/i,
  /\b(customer service|support team|security team|fraud department|verification team)\b/i,
  /\b(reference no|case no|complaint no|ticket no|id no)\b/i,
];

const FINANCIAL_PATTERNS = [
  /\b(transfer|payment|pay|send money|wire|deposit|withdraw|refund|claim)\b/i,
  /\b(bank account|account number|ifsc|swift|routing|sort code)\b/i,
  /\b(upi|gpay|phonepe|paytm|venmo|zelle|paypal)\b/i,
  /\b(\$[\d,]+|₹[\d,]+|€[\d,]+|£[\d,]+|\d+ (dollars|rupees|euros))\b/i,
];

const CREDENTIAL_PATTERNS = [
  /\b(password|passwd|pin|cvv|otp|verification code|security code|login|credential)\b/i,
  /\b(sign in|log in|verify your|confirm your|update your|validate your)\b/i,
  /\b(username|user id|email.*password|account.*details)\b/i,
];

const OTP_PATTERNS = [
  /\b(otp|one.?time|verification code|auth code|security code|mfa code|2fa)\b/i,
  /\b(share.*code|send.*code|tell.*code|read.*code|confirm.*code)\b/i,
];

const THREAT_PATTERNS = [
  /\b(will be arrested|will be sued|legal action|court|jail|prison|prosecuted)\b/i,
  /\b(will block|will freeze|will suspend|will terminate|will cancel|will disconnect)\b/i,
  /\b(your family|your relatives|your employer|will be informed|will be notified)\b/i,
];

const REWARD_PATTERNS = [
  /\b(won|winner|congratulations|selected|chosen|lucky|prize|reward|gift|bonus|cashback)\b/i,
  /\b(free|claim your|collect your|redeem|lottery|draw|sweepstake)\b/i,
  /\b(\$\d+.*prize|\d+.*reward|cash prize|gift card|voucher)\b/i,
];

const LINK_PATTERNS = [
  /https?:\/\/[^\s]+/gi,
  /\b(click here|tap here|visit|open this|check this|see this)\b.*\b(link|url|site|page)\b/i,
];

function detectPatterns(text: string, patterns: RegExp[]): { score: number; matches: string[] } {
  let score = 0;
  const matches: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      score += 25;
      matches.push(match[0]);
    }
  }
  return { score: Math.min(100, score), matches };
}

export function analyzeMessage(input: string): MessageAnalysisResult {
  const message = input.trim();
  if (!message) {
    return {
      message: '', score: 0, level: 'safe', indicators: [],
      explanation: 'No message provided to analyze.',
      safeActions: ['Enter a message to analyze.'],
    };
  }

  const urgency = detectPatterns(message, URGENCY_PATTERNS);
  const fear = detectPatterns(message, FEAR_PATTERNS);
  const authority = detectPatterns(message, AUTHORITY_PATTERNS);
  const financial = detectPatterns(message, FINANCIAL_PATTERNS);
  const credential = detectPatterns(message, CREDENTIAL_PATTERNS);
  const otp = detectPatterns(message, OTP_PATTERNS);
  const threat = detectPatterns(message, THREAT_PATTERNS);
  const reward = detectPatterns(message, REWARD_PATTERNS);
  const links = detectPatterns(message, LINK_PATTERNS);

  const indicators = [
    { name: 'Urgency', value: urgency.score, detected: urgency.matches },
    { name: 'Fear', value: fear.score, detected: fear.matches },
    { name: 'Authority', value: authority.score, detected: authority.matches },
    { name: 'Financial Pressure', value: financial.score, detected: financial.matches },
    { name: 'Credential Request', value: credential.score, detected: credential.matches },
    { name: 'OTP/Code Request', value: otp.score, detected: otp.matches },
    { name: 'Threats', value: threat.score, detected: threat.matches },
    { name: 'Reward/Lottery', value: reward.score, detected: reward.matches },
    { name: 'Suspicious Links', value: links.score, detected: links.matches },
  ];

  // Calculate overall score
  const highIndicators = indicators.filter(i => i.value >= 50).length;
  const medIndicators = indicators.filter(i => i.value >= 25 && i.value < 50).length;
  let score = highIndicators * 20 + medIndicators * 8;

  // Combination penalties
  if (urgency.score > 0 && fear.score > 0) score += 15;
  if (authority.score > 0 && credential.score > 0) score += 15;
  if (threat.score > 0 && financial.score > 0) score += 15;
  if (otp.score > 0 && urgency.score > 0) score += 10;

  score = Math.min(100, score);

  let level: MessageAnalysisResult['level'] = 'safe';
  if (score >= 60) level = 'dangerous';
  else if (score >= 35) level = 'suspicious';
  else if (score >= 15) level = 'caution';

  let explanation = '';
  if (level === 'safe') {
    explanation = 'This message does not show obvious scam indicators. However, always verify unexpected messages from unknown senders.';
  } else if (level === 'caution') {
    explanation = 'This message contains some elements commonly found in scam messages. Exercise caution and verify through official channels.';
  } else if (level === 'suspicious') {
    const topIndicators = indicators.filter(i => i.value >= 25).map(i => i.name.toLowerCase()).join(', ');
    explanation = `This message shows multiple scam indicators including ${topIndicators}. This combination is commonly seen in phishing and fraud attempts.`;
  } else {
    const topIndicators = indicators.filter(i => i.value >= 50).map(i => i.name.toLowerCase()).join(', ');
    explanation = `This message strongly resembles a scam. Key indicators: ${topIndicators}. Do not respond or share any information.`;
  }

  const safeActions: string[] = [];
  if (level === 'safe') {
    safeActions.push('If unexpected, verify the sender through a separate channel.');
  } else if (level === 'caution') {
    safeActions.push('Do not click any links in this message.');
    safeActions.push('Verify the sender through official channels.');
  } else if (level === 'suspicious') {
    safeActions.push('Do not respond to this message.');
    safeActions.push('Do not click any links or download attachments.');
    safeActions.push('Block the sender and report as spam.');
  } else {
    safeActions.push('Do not respond, click links, or share any information.');
    safeActions.push('Take a screenshot for evidence.');
    safeActions.push('Block and report the sender immediately.');
  }

  return { message, score, level, indicators, explanation, safeActions };
}
