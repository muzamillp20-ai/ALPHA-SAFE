// Cyber Crime Safety Center - Comprehensive Knowledge Base
// All content is educational and defensive in nature

export interface SafetyTopic {
  id: string;
  title: string;
  category: 'financial' | 'account' | 'social-engineering' | 'online-privacy';
  description: string;
  whatIsIt: string;
  howItHappens: string[];
  warningSigns: string[];
  precautions: string[];
  neverDo: string[];
  ifItHappens: string[];
  firstTenMinutes: string[];
  evidence: string[];
  contacts: string[];
  reporting: string;
  recovery: string[];
  commonMistakes: string[];
  example: {
    received: string;
    claimed: string;
    warningSigns: string[];
    shouldDo: string[];
  };
  quickChecklist: string[];
  relatedFeatures: string[];
  sources: string[];
  lastVerified: string;
}

export const SAFETY_TOPICS: SafetyTopic[] = [
  {
    id: 'otp-scam',
    title: 'OTP Scam',
    category: 'financial',
    description: 'Scammers trick you into sharing One-Time Passwords to access your accounts',
    whatIsIt: 'An OTP (One-Time Password) is a secure code sent to your phone or email to verify your identity during transactions or login. Scammers use social engineering to trick you into sharing this code, giving them access to your accounts.',
    howItHappens: [
      'You receive an unexpected call, SMS, or message',
      'The person claims to be from your bank, payment app, or a trusted service',
      'They create urgency (account blocked, unauthorized transaction, etc.)',
      'They ask you to share the OTP "to verify" or "to cancel" something',
      'You share the OTP',
      'They use it to authorize a transaction or access your account'
    ],
    warningSigns: [
      'Unexpected OTP received when you didn\'t initiate any action',
      'Caller asking for OTP or verification code',
      'Claims of account being blocked or compromised',
      'Urgency to act immediately',
      'Threats of account suspension',
      'Requests to read OTP aloud',
      'Unknown caller claiming to be from bank/service'
    ],
    precautions: [
      'Never share OTP with anyone, ever',
      'Banks and services NEVER ask for OTP over phone',
      'If you receive unexpected OTP, ignore it',
      'Verify by calling official number from app/website',
      'Don\'t click links in suspicious messages',
      'Enable biometric authentication where available',
      'Keep your phone number updated with your bank'
    ],
    neverDo: [
      'Never share OTP with anyone',
      'Never read OTP aloud to caller',
      'Never enter OTP on suspicious websites',
      'Never forward OTP messages',
      'Never install apps at caller\'s request',
      'Never share UPI PIN, ATM PIN, CVV, or password'
    ],
    ifItHappens: [
      'Stop all communication immediately',
      'Don\'t share any more information',
      'Check your bank/payment app for unauthorized transactions',
      'Call your bank on official number (from app/website)',
      'Change your account password',
      'Enable/change 2FA if available',
      'Take screenshots of all messages/calls',
      'Report to bank and cybercrime portal'
    ],
    firstTenMinutes: [
      '01: Stop communication with the scammer',
      '02: Check your bank app for unauthorized transactions',
      '03: Call bank on official number (1930 for cyber fraud)',
      '04: Freeze/block affected cards if needed',
      '05: Take screenshots of all evidence',
      '06: Change account password immediately',
      '07: Report on cybercrime.gov.in',
      '08: Document timeline of events',
      '09: Contact payment app support if UPI involved',
      '10: Save all call logs and messages'
    ],
    evidence: [
      'Screenshots of OTP messages',
      'Call logs with phone numbers',
      'SMS messages from scammer',
      'WhatsApp/chat conversations',
      'Transaction details if any occurred',
      'Date and time of incident',
      'Any links or apps shared',
      'Bank account statements'
    ],
    contacts: [
      'Your bank\'s official customer care (from app/website)',
      '1930 - National Cyber Crime Helpline',
      'Payment app support (from official app)',
      'Local police if threats involved'
    ],
    reporting: 'Report immediately at cybercrime.gov.in or call 1930. For bank fraud, also inform your bank. ALPHA SAFE can help you document and prepare your complaint.',
    recovery: [
      'Monitor all accounts for suspicious activity',
      'Change passwords on all important accounts',
      'Enable 2FA everywhere possible',
      'Review connected devices and sessions',
      'Update security questions',
      'Be extra cautious of follow-up scam attempts',
      'Consider credit freeze if identity compromised'
    ],
    commonMistakes: [
      'Continuing to talk to the scammer',
      'Sharing OTP "just to verify"',
      'Believing caller ID shows bank name',
      'Clicking links sent by "bank"',
      'Installing apps to "fix" the problem',
      'Waiting too long to report',
      'Deleting evidence'
    ],
    example: {
      received: 'Call from +91-98XXXXXXXX claiming to be from HDFC Bank',
      claimed: 'Your account has unauthorized transaction of ₹25,000. Share OTP to cancel it.',
      warningSigns: ['Unexpected call', 'Asking for OTP', 'Creating urgency', 'Unknown number'],
      shouldDo: ['Hang up immediately', 'Check HDFC app directly', 'Call bank on official number', 'Report if suspicious']
    },
    quickChecklist: [
      'I understand OTP should never be shared',
      'I know banks never ask for OTP over phone',
      'I know how to verify official bank numbers',
      'I know what evidence to preserve',
      'I know to report at cybercrime.gov.in'
    ],
    relatedFeatures: ['flashcards-otp', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['RBI Guidelines', 'National Cyber Crime Portal'],
    lastVerified: '2026-01'
  },
  {
    id: 'upi-fraud',
    title: 'UPI Fraud',
    category: 'financial',
    description: 'Fraudulent UPI transactions through fake payment requests, QR codes, or deceptive methods',
    whatIsIt: 'UPI (Unified Payments Interface) fraud involves scammers tricking you into sending money or authorizing payments through deceptive methods like fake QR codes, collect requests disguised as refunds, or malicious payment links.',
    howItHappens: [
      'Scammer poses as customer/buyer/seller',
      'They send fake payment request or QR code',
      'Claim you will RECEIVE money',
      'You scan QR or approve request thinking it\'s incoming',
      'Actually authorizing outgoing payment',
      'Money leaves your account'
    ],
    warningSigns: [
      'QR code with "request" or "collect" instead of "receive"',
      'Being asked to scan QR to receive money',
      'Payment request from unknown person',
      'Urgency to complete transaction',
      'Claims of overpayment needing refund',
      'Requests to enter UPI PIN to receive money',
      'Suspicious payment links'
    ],
    precautions: [
      'To RECEIVE money, you NEVER need to scan QR or enter PIN',
      'Only enter UPI PIN when SENDING money',
      'Verify recipient details before confirming',
      'Don\'t scan QR codes from untrusted sources',
      'Use official UPI apps only',
      'Check transaction details carefully',
      'Be suspicious of "too good" deals'
    ],
    neverDo: [
      'Never scan QR to receive money',
      'Never enter UPI PIN to receive payment',
      'Never share UPI ID with strangers',
      'Never approve collect requests from unknown',
      'Never click payment links from SMS/email',
      'Never share screenshot of UPI app'
    ],
    ifItHappens: [
      'Stop the transaction immediately if possible',
      'Note the transaction ID and recipient details',
      'Call your bank on official number',
      'Report on cybercrime.gov.in within golden hour',
      'Raise dispute in UPI app',
      'Take screenshots of all evidence',
      'Block the scammer\'s number',
      'File police complaint if amount is large'
    ],
    firstTenMinutes: [
      '01: Call bank immediately on official number',
      '02: Report transaction in UPI app',
      '03: Call 1930 cyber crime helpline',
      '04: Note transaction ID and timestamp',
      '05: Screenshot all app screens',
      '06: Report on cybercrime.gov.in',
      '07: Block scammer\'s number/UPI ID',
      '08: Check for other unauthorized transactions',
      '09: Save chat/call evidence',
      '10: Document everything in timeline'
    ],
    evidence: [
      'Transaction ID and details',
      'Screenshots of UPI app',
      'QR code image if scanned',
      'Chat/call with scammer',
      'Recipient UPI ID/number',
      'Date and time of transaction',
      'Bank statement showing deduction',
      'Any payment links clicked'
    ],
    contacts: [
      'Your bank\'s fraud department',
      'UPI app support (Google Pay/PhonePe/Paytm)',
      '1930 - National Cyber Crime Helpline',
      'NPCI (for UPI disputes)'
    ],
    reporting: 'Report immediately at cybercrime.gov.in. For UPI fraud, also raise dispute in your UPI app and inform your bank. Time is critical - report within hours if possible.',
    recovery: [
      'Monitor account for further unauthorized transactions',
      'Follow up with bank on dispute status',
      'Keep all communication records',
      'Be aware of refund scams (fake claims of processing refund)',
      'Consider changing UPI PIN',
      'Review transaction history regularly',
      'Enable transaction alerts'
    ],
    commonMistakes: [
      'Scanning QR to "receive" money',
      'Entering PIN for incoming payment',
      'Trusting "customer" who overpaid',
      'Not verifying recipient details',
      'Delaying reporting',
      'Believing fake refund messages',
      'Sharing UPI screenshots'
    ],
    example: {
      received: 'Person claims to buy item, sends QR saying "scan to receive ₹5000"',
      claimed: 'Scan this QR to receive payment for the item you\'re selling',
      warningSigns: ['QR to receive money', 'Asking to scan', 'Unknown buyer', 'Urgency'],
      shouldDo: ['Never scan QR to receive', 'Ask for direct UPI transfer', 'Verify buyer identity', 'Use trusted platforms']
    },
    quickChecklist: [
      'I know I never scan QR to receive money',
      'I know UPI PIN is only for sending money',
      'I verify recipient before confirming',
      'I know to report within golden hour',
      'I preserve all transaction evidence'
    ],
    relatedFeatures: ['flashcards-banking', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['NPCI Guidelines', 'RBI Circulars', 'Cyber Crime Portal'],
    lastVerified: '2026-01'
  },
  {
    id: 'digital-arrest',
    title: 'Digital Arrest Scam',
    category: 'social-engineering',
    description: 'Fake police/cyber crime officers claim to arrest you digitally and demand money',
    whatIsIt: 'Scammers impersonate police, CBI, ED, or cyber crime officers, claiming you\'re under investigation. They threaten "digital arrest" via video call and demand money to "clear your name" or "avoid arrest". This is always a scam - no legal authority operates this way.',
    howItHappens: [
      'You receive call from fake police/cyber crime officer',
      'They claim your phone number is linked to crime/money laundering',
      'Threaten immediate arrest or account freeze',
      'Ask you to join video call for "verification"',
      'Show fake ID cards, warrants, or office backgrounds',
      'Demand money transfer to "verification account"',
      'Keep you on call for hours to prevent thinking'
    ],
    warningSigns: [
      'Caller claiming to be police/CBI/ED/cyber crime',
      'Threats of immediate arrest',
      'Requests for video call',
      'Asking to download specific apps',
      'Demanding money transfer',
      'Showing fake ID cards on video',
      'Keeping you isolated on long calls',
      'Claiming your account will be frozen',
      'Asking for personal/banking details'
    ],
    precautions: [
      'Police NEVER call to announce arrest',
      'No "digital arrest" exists in law',
      'Real officers never ask for money',
      'Never join video calls with unknown callers',
      'Never download apps on their instruction',
      'Verify by calling police on 112',
      'Hang up immediately if threatened',
      'Real investigations don\'t work over phone'
    ],
    neverDo: [
      'Never believe "digital arrest" threats',
      'Never join video calls with fake police',
      'Never download apps they suggest',
      'Never transfer money to "verify" accounts',
      'Never share banking details',
      'Never stay on call for hours',
      'Never believe fake ID cards on video',
      'Never let them isolate you from family'
    ],
    ifItHappens: [
      'Hang up immediately',
      'Don\'t engage or argue',
      'Call police on 112 to verify',
      'Don\'t download any apps',
      'Don\'t transfer any money',
      'Screenshot call logs and messages',
      'Report to cyber crime portal',
      'Inform family members',
      'Block the number',
      'File FIR if money was lost'
    ],
    firstTenMinutes: [
      '01: Hang up the call immediately',
      '02: Don\'t download anything',
      '03: Call 112 to verify with real police',
      '04: Screenshot call logs',
      '05: Save any messages received',
      '06: Block the scammer\'s number',
      '07: Inform family/friends',
      '08: Report on cybercrime.gov.in',
      '09: Check if any money was transferred',
      '10: Document everything'
    ],
    evidence: [
      'Call logs with phone numbers',
      'Screenshots of messages',
      'Any apps they asked to install',
      'Video call recordings if any',
      'Fake ID cards shown',
      'Bank transaction details if money sent',
      'Date, time, duration of calls',
      'Any WhatsApp/chat conversations'
    ],
    contacts: [
      '112 - National Emergency Number',
      'Local police station',
      '1930 - Cyber Crime Helpline',
      'State cyber crime cell'
    ],
    reporting: 'Report immediately at cybercrime.gov.in or call 1930. If money was transferred, also file FIR at local police station. This is a serious crime - don\'t hesitate to report.',
    recovery: [
      'Change all important passwords',
      'Monitor bank accounts closely',
      'Check phone for any installed malware',
      'Be aware of follow-up scam calls',
      'Inform contacts about the scam',
      'Follow up on police complaint',
      'Consider credit monitoring if KYC shared',
      'Stay vigilant for months'
    ],
    commonMistakes: [
      'Believing the caller is real police',
      'Staying on call out of fear',
      'Downloading apps they suggest',
      'Transferring money to "verify"',
      'Not verifying with real police',
      'Being isolated from family advice',
      'Thinking you can "cooperate" your way out',
      'Delaying reporting due to shame'
    ],
    example: {
      received: 'Call from +91-11-XXXXXXXX claiming to be Mumbai Cyber Crime',
      claimed: 'Your number is linked to money laundering. Join video call or face arrest.',
      warningSigns: ['Fake police', 'Video call request', 'Arrest threat', 'Unknown number'],
      shouldDo: ['Hang up immediately', 'Call 112 to verify', 'Never join video call', 'Report to cyber crime']
    },
    quickChecklist: [
      'I know police never call to arrest',
      'I know "digital arrest" is fake',
      'I never join video calls with strangers',
      'I verify by calling 112',
      'I report immediately if targeted'
    ],
    relatedFeatures: ['digital-arrest-simulation', 'flashcards-digital-arrest', 'incident-workspace', 'complaint-center'],
    sources: ['Ministry of Home Affairs', 'Indian Cyber Crime Coordination Centre'],
    lastVerified: '2026-01'
  },
  {
    id: 'phishing',
    title: 'Phishing',
    category: 'social-engineering',
    description: 'Fake emails, messages, or websites designed to steal your login credentials',
    whatIsIt: 'Phishing is when scammers send fake emails, SMS, or create fake websites that look like legitimate services (banks, social media, etc.) to trick you into entering your username, password, OTP, or other sensitive information.',
    howItHappens: [
      'You receive email/SMS appearing to be from trusted source',
      'Message creates urgency (account suspended, verify now, etc.)',
      'Contains link to fake website that looks real',
      'You enter login details on fake site',
      'Scammers capture your credentials',
      'They access your real account'
    ],
    warningSigns: [
      'Unexpected emails/messages asking to verify account',
      'Urgent language (suspended, blocked, immediately)',
      'Suspicious sender email address',
      'Links that don\'t match the claimed website',
      'Requests for password, OTP, or personal info',
      'Poor grammar or spelling in official-looking messages',
      'Generic greetings instead of your name',
      'Threats of account closure'
    ],
    precautions: [
      'Never click links in suspicious emails',
      'Always type website address directly',
      'Check sender email carefully',
      'Hover over links to see actual destination',
      'Banks never ask for password via email',
      'Enable 2FA on all accounts',
      'Use password manager',
      'Verify by contacting company directly'
    ],
    neverDo: [
      'Never click suspicious links',
      'Never enter credentials on suspicious sites',
      'Never share password via email',
      'Never download attachments from unknown senders',
      'Never trust urgent email requests',
      'Never use links from SMS/email for banking',
      'Never ignore sender address checks'
    ],
    ifItHappens: [
      'Change password immediately on real website',
      'Enable/change 2FA',
      'Check account for unauthorized activity',
      'Report phishing email to the real company',
      'Forward to reportphishing@apple.com, etc.',
      'Run antivirus scan if downloaded anything',
      'Monitor accounts closely',
      'Report to cybercrime.gov.in if credentials compromised'
    ],
    firstTenMinutes: [
      '01: Don\'t click any more links',
      '02: If entered credentials, change password NOW',
      '03: Enable 2FA immediately',
      '04: Check account for unauthorized activity',
      '05: Screenshot the phishing email/message',
      '06: Report to the real company',
      '07: Run security scan on device',
      '08: Check other accounts using same password',
      '09: Report to cybercrime.gov.in',
      '10: Document everything'
    ],
    evidence: [
      'Full email headers',
      'Screenshot of phishing email',
      'Fake website URL',
      'Screenshots of fake login page',
      'Any downloaded files',
      'Sender email address',
      'Date and time received',
      'What information was entered'
    ],
    contacts: [
      'The real company\'s security team',
      'Your bank if banking credentials compromised',
      '1930 - Cyber Crime Helpline',
      'Email provider (Gmail, Outlook, etc.)'
    ],
    reporting: 'Report to the impersonated company and cybercrime.gov.in. Most email providers have "Report Phishing" buttons. If financial accounts affected, inform bank immediately.',
    recovery: [
      'Change all passwords that might be compromised',
      'Enable 2FA everywhere',
      'Monitor all accounts for suspicious activity',
      'Check for unauthorized transactions',
      'Review connected apps and devices',
      'Update security questions',
      'Be alert for follow-up phishing attempts',
      'Consider credit freeze if personal info shared'
    ],
    commonMistakes: [
      'Clicking links in urgent emails',
      'Not checking sender address',
      'Entering credentials without verifying URL',
      'Ignoring browser security warnings',
      'Using same password everywhere',
      'Not enabling 2FA',
      'Deleting phishing email without reporting'
    ],
    example: {
      received: 'Email from "security@apple-id-verify.com" saying account locked',
      claimed: 'Your Apple ID has been locked. Click here to verify and unlock.',
      warningSigns: ['Fake sender domain', 'Urgency', 'Suspicious link', 'Requesting credentials'],
      shouldDo: ['Don\'t click link', 'Go to appleid.apple.com directly', 'Check account status there', 'Report phishing email']
    },
    quickChecklist: [
      'I check sender email carefully',
      'I never click urgent email links',
      'I type website addresses directly',
      'I enable 2FA on all accounts',
      'I report phishing attempts'
    ],
    relatedFeatures: ['phishing-lab', 'url-intelligence', 'message-intelligence', 'flashcards-phishing'],
    sources: ['Anti-Phishing Working Group', 'CERT-In'],
    lastVerified: '2026-01'
  },
  {
    id: 'job-scam',
    title: 'Job Scam',
    category: 'social-engineering',
    description: 'Fake job offers that ask for registration fees, personal details, or advance payments',
    whatIsIt: 'Scammers pose as recruiters or companies offering attractive job opportunities, often work-from-home with high pay. They ask for registration fees, training fees, or personal documents, then disappear or use your information for fraud.',
    howItHappens: [
      'You see attractive job posting (high pay, easy work)',
      'Contact via WhatsApp/email/Telegram',
      'Quick interview or no interview',
      'Offer letter sent immediately',
      'Ask for registration/training fee',
      'Request personal documents (Aadhaar, PAN, bank details)',
      'After payment, they disappear or ask for more'
    ],
    warningSigns: [
      'Too good to be true salary',
      'No proper interview process',
      'Asking for money upfront',
      'Requesting personal documents early',
      'Unknown company with no web presence',
      'Generic email addresses (Gmail, not company domain)',
      'Pressure to join immediately',
      'Work-from-home with minimal qualifications',
      'Asking for bank details before joining'
    ],
    precautions: [
      'Legitimate jobs NEVER ask for money',
      'Research company thoroughly',
      'Check company website and reviews',
      'Verify through official channels',
      'Never pay registration/training fees',
      'Don\'t share documents until verified',
      'Be suspicious of instant offers',
      'Check LinkedIn for company and recruiters'
    ],
    neverDo: [
      'Never pay to get a job',
      'Never share bank details before verification',
      'Never send Aadhaar/PAN to unverified sources',
      'Never accept offers without interview',
      'Never trust only WhatsApp communication',
      'Never ignore red flags for high salary',
      'Never skip company research'
    ],
    ifItHappens: [
      'Stop all communication',
      'Don\'t pay any more money',
      'Don\'t share more documents',
      'Screenshot all conversations',
      'Report to cybercrime.gov.in',
      'If documents shared, monitor for misuse',
      'If money paid, inform bank immediately',
      'Report fake job portal if applicable',
      'Warn others on social media/review sites'
    ],
    firstTenMinutes: [
      '01: Stop communication immediately',
      '02: Don\'t pay anything more',
      '03: Screenshot all chats and emails',
      '04: Save job posting details',
      '05: Note all shared information',
      '06: Report on cybercrime.gov.in',
      '07: If money sent, call bank',
      '08: Check if documents can be secured',
      '09: Research company online',
      '10: Document everything'
    ],
    evidence: [
      'Job posting screenshots',
      'All chat conversations',
      'Email correspondence',
      'Offer letter if received',
      'Payment receipts',
      'Documents shared',
      'Company details provided',
      'Contact numbers/IDs'
    ],
    contacts: [
      '1930 - Cyber Crime Helpline',
      'Local police if large amount lost',
      'Job portal support (if posted there)',
      'Bank if payment made'
    ],
    reporting: 'Report at cybercrime.gov.in. If posted on job portal, report to them. If money lost, inform bank. For identity document misuse, consider filing FIR.',
    recovery: [
      'Monitor bank accounts if details shared',
      'Watch for identity misuse',
      'Consider credit monitoring',
      'Be alert for follow-up scams',
      'Warn others about the fake company',
      'Keep all evidence for police',
      'Follow up on complaint status',
      'Be extra cautious of future job offers'
    ],
    commonMistakes: [
      'Believing too-good-to-be-true offers',
      'Paying registration fees',
      'Sharing documents too early',
      'Not researching the company',
      'Trusting WhatsApp-only communication',
      'Ignoring red flags for high salary',
      'Not verifying company existence'
    ],
    example: {
      received: 'WhatsApp message offering data entry job, ₹40,000/month, work from home',
      claimed: 'Pay ₹2,500 registration fee to start earning immediately',
      warningSigns: ['High pay for simple work', 'Registration fee', 'WhatsApp only', 'No interview'],
      shouldDo: ['Never pay to work', 'Research company', 'Verify through official channels', 'Report suspicious offers']
    },
    quickChecklist: [
      'I know legitimate jobs never ask for money',
      'I research companies before applying',
      'I don\'t share documents without verification',
      'I verify through official channels',
      'I report fake job offers'
    ],
    relatedFeatures: ['flashcards-job', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['Ministry of Labour', 'Consumer Protection Guidelines'],
    lastVerified: '2026-01'
  },
  {
    id: 'qr-code-scam',
    title: 'QR Code Scam',
    category: 'financial',
    description: 'Fake QR codes that trick you into sending money instead of receiving it',
    whatIsIt: 'Scammers use QR codes deceptively. They claim you\'ll receive money by scanning, but the QR actually sends money FROM your account. Or they replace legitimate QR codes with fake ones to divert payments.',
    howItHappens: [
      'Scammer claims to pay you (for selling item, refund, etc.)',
      'Sends QR code saying "scan to receive"',
      'You scan thinking it\'s incoming payment',
      'Actually authorizing outgoing payment',
      'Money leaves your account',
      'Or: Scammer replaces shop QR with their own',
      'Customer pays to scammer instead of shop'
    ],
    warningSigns: [
      'Being asked to scan QR to receive money',
      'QR code with "Pay" instead of "Receive"',
      'Unknown person sending QR',
      'Claims you need to enter PIN to receive',
      'QR codes in unusual places',
      'Scratched or replaced QR codes',
      'Urgency to scan quickly',
      'Requests to scan before delivering goods'
    ],
    precautions: [
      'To RECEIVE money, you NEVER scan QR',
      'Only scan QR when YOU are paying',
      'Verify QR code physically at shops',
      'Check recipient name before confirming',
      'Never enter PIN to receive money',
      'Be suspicious of unsolicited QR codes',
      'Use official payment apps only',
      'Verify merchant details'
    ],
    neverDo: [
      'Never scan QR to receive money',
      'Never enter UPI PIN to receive payment',
      'Never scan QR from untrusted sources',
      'Never scan scratched/replaced QR codes',
      'Never share QR code screenshots',
      'Never scan before verifying recipient',
      'Never trust "scan to get refund" claims'
    ],
    ifItHappens: [
      'Note transaction details immediately',
      'Call bank on official number',
      'Report in payment app',
      'Call 1930 cyber crime helpline',
      'Screenshot everything',
      'Report on cybercrime.gov.in',
      'Block the scammer',
      'If at shop, inform merchant',
      'Check for other unauthorized transactions'
    ],
    firstTenMinutes: [
      '01: Note transaction ID and amount',
      '02: Call bank immediately',
      '03: Report in payment app',
      '04: Call 1930',
      '05: Screenshot transaction and QR',
      '06: Report on cybercrime.gov.in',
      '07: Block scammer\'s number',
      '08: Check account for other frauds',
      '09: Save all evidence',
      '10: Document timeline'
    ],
    evidence: [
      'Transaction screenshot',
      'QR code image',
      'Chat with scammer',
      'Recipient details shown',
      'Date and time',
      'Payment app logs',
      'Bank statement',
      'Any call recordings'
    ],
    contacts: [
      'Payment app support',
      'Bank fraud department',
      '1930 - Cyber Crime Helpline',
      'Merchant if QR replaced at shop'
    ],
    reporting: 'Report at cybercrime.gov.in immediately. Raise dispute in payment app. Inform bank. Time is critical for fund recovery.',
    recovery: [
      'Monitor account closely',
      'Follow up on dispute',
      'Change UPI PIN',
      'Review transaction history',
      'Enable transaction alerts',
      'Be alert for refund scams',
      'Keep all communication records',
      'Follow up with bank regularly'
    ],
    commonMistakes: [
      'Scanning QR to receive money',
      'Entering PIN for incoming payment',
      'Not verifying recipient name',
      'Trusting unsolicited QR codes',
      'Scanning replaced QR at shops',
      'Delaying reporting',
      'Believing "scan to get refund"'
    ],
    example: {
      received: 'Buyer sends QR code saying "scan this to receive ₹3000 for the item"',
      claimed: 'Scan this QR code and I\'ll send you money immediately',
      warningSigns: ['QR to receive', 'Unknown buyer', 'Asking to scan', 'Urgency'],
      shouldDo: ['Never scan to receive', 'Ask for direct UPI transfer', 'Verify buyer', 'Use trusted platforms']
    },
    quickChecklist: [
      'I know I never scan QR to receive money',
      'I verify recipient before paying',
      'I check QR codes at shops',
      'I never enter PIN to receive',
      'I report QR fraud immediately'
    ],
    relatedFeatures: ['flashcards-banking', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['NPCI Guidelines', 'RBI Advisory'],
    lastVerified: '2026-01'
  },
  {
    id: 'investment-scam',
    title: 'Investment Scam',
    category: 'financial',
    description: 'Fake investment opportunities promising guaranteed high returns',
    whatIsIt: 'Scammers offer fake investment opportunities in crypto, stocks, forex, or businesses, promising guaranteed high returns with low risk. They use fake platforms, manipulated screenshots, and pressure tactics to get your money, which is never returned.',
    howItHappens: [
      'Contact via social media/WhatsApp/Telegram',
      'Build trust over time (sometimes weeks)',
      'Show fake profits/screenshots',
      'Add to "investment group" with fake members',
      'Small initial investment "works" to build trust',
      'Pressure to invest more',
      'When you try to withdraw, they ask for "tax" or "fees"',
      'Eventually disappear with all money'
    ],
    warningSigns: [
      'Guaranteed high returns',
      'Low risk claims',
      'Pressure to invest quickly',
      'Unknown/unregistered platform',
      'Requests for crypto/wire transfers',
      'Fake profit screenshots',
      'WhatsApp/Telegram groups',
      'Unregistered "advisors"',
      'Withdrawal fees or taxes demanded',
      'No proper documentation'
    ],
    precautions: [
      'No investment guarantees high returns',
      'Verify SEBI registration',
      'Research platform thoroughly',
      'Never invest via WhatsApp/Telegram tips',
      'Use only registered brokers',
      'Be suspicious of "guaranteed" returns',
      'Check company registration',
      'Start very small if testing'
    ],
    neverDo: [
      'Never trust guaranteed returns',
      'Never invest on unregistered platforms',
      'Never follow WhatsApp/Telegram tips',
      'Never pay "tax" to withdraw',
      'Never invest more to "unlock" funds',
      'Never share trading account credentials',
      'Never ignore SEBI warnings',
      'Never trust fake profit screenshots'
    ],
    ifItHappens: [
      'Stop investing immediately',
      'Don\'t pay any more "fees"',
      'Screenshot everything',
      'Report to SEBI if securities involved',
      'Report on cybercrime.gov.in',
      'Inform bank for transactions',
      'If crypto, note wallet addresses',
      'File police complaint',
      'Warn others in the group',
      'Don\'t trust "recovery services"'
    ],
    firstTenMinutes: [
      '01: Stop all investments immediately',
      '02: Don\'t pay withdrawal fees',
      '03: Screenshot platform and chats',
      '04: Note all wallet/account details',
      '05: Report on cybercrime.gov.in',
      '06: Inform bank of fraud',
      '07: If SEBI-regulated, report to SEBI',
      '08: Save all transaction proofs',
      '09: Document timeline',
      '10: Block scammers'
    ],
    evidence: [
      'Platform screenshots',
      'All chat conversations',
      'Transaction records',
      'Wallet addresses (if crypto)',
      'Fake profit screenshots',
      'Platform URL/details',
      'Contact details of scammers',
      'Any documents shared'
    ],
    contacts: [
      'SEBI (for securities fraud)',
      '1930 - Cyber Crime Helpline',
      'Bank for transactions',
      'Crypto exchange if applicable',
      'Local police for FIR'
    ],
    reporting: 'Report at cybercrime.gov.in. For securities fraud, also report to SEBI. File FIR with police. Recovery is difficult but reporting helps prevent others from being scammed.',
    recovery: [
      'Accept money may not be recovered',
      'Beware of "recovery service" scams',
      'Monitor for follow-up scams',
      'Keep all evidence safe',
      'Follow up on complaints',
      'Learn from the experience',
      'Warn others',
      'Be extra cautious of future offers'
    ],
    commonMistakes: [
      'Believing guaranteed returns',
      'Investing on unregistered platforms',
      'Paying "fees" to withdraw',
      'Investing more to "unlock"',
      'Trusting social media tips',
      'Not verifying SEBI registration',
      'Ignoring warning signs',
      'Falling for "recovery services"'
    ],
    example: {
      received: 'WhatsApp group showing daily profits in crypto trading',
      claimed: 'Invest ₹50,000, earn 10% daily guaranteed returns',
      warningSigns: ['Guaranteed returns', 'WhatsApp group', 'High daily returns', 'Unknown platform'],
      shouldDo: ['Never trust guaranteed returns', 'Verify SEBI registration', 'Research platform', 'Report suspicious schemes']
    },
    quickChecklist: [
      'I know no investment guarantees returns',
      'I verify SEBI registration',
      'I don\'t trust WhatsApp tips',
      'I research platforms thoroughly',
      'I report investment fraud'
    ],
    relatedFeatures: ['flashcards-investment', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['SEBI Investor Alerts', 'RBI Warnings'],
    lastVerified: '2026-01'
  },
  {
    id: 'account-takeover',
    title: 'Account Takeover',
    category: 'account',
    description: 'Unauthorized access to your email, social media, or other online accounts',
    whatIsIt: 'When someone gains unauthorized access to your online accounts (email, social media, banking, etc.) through stolen credentials, phishing, or other methods. They may lock you out, impersonate you, or use the account for fraud.',
    howItHappens: [
      'Your credentials are stolen (phishing, data breach)',
      'Or attacker guesses weak password',
      'They login to your account',
      'Change password to lock you out',
      'Update recovery options to their control',
      'Use account for fraud/impersonation',
      'Access other accounts via password reuse'
    ],
    warningSigns: [
      'Can\'t login to your account',
      'Password not working',
      'Unusual activity notifications',
      'Login attempts from unknown locations',
      'Friends report strange messages from you',
      'Recovery email/phone changed',
      '2FA disabled without your action',
      'New devices logged in'
    ],
    precautions: [
      'Use strong, unique passwords',
      'Enable 2FA on all accounts',
      'Use password manager',
      'Don\'t reuse passwords',
      'Be alert to phishing',
      'Regularly check logged-in devices',
      'Keep recovery options updated',
      'Monitor account activity'
    ],
    neverDo: [
      'Never use same password everywhere',
      'Never share login credentials',
      'Never click suspicious login links',
      'Never ignore security alerts',
      'Never skip 2FA setup',
      'Never use weak passwords',
      'Never ignore unusual activity'
    ],
    ifItHappens: [
      'Try to login immediately',
      'Use "forgot password" if locked out',
      'Contact platform support',
      'Check recovery email for alerts',
      'Scan device for malware',
      'Change passwords on other accounts',
      'Report to platform',
      'Inform contacts about compromise',
      'Document unauthorized activity',
      'Report to cybercrime if fraud involved'
    ],
    firstTenMinutes: [
      '01: Try to login immediately',
      '02: Use password reset if needed',
      '03: Contact platform support',
      '04: Check recovery email',
      '05: Change passwords on other accounts',
      '06: Scan device for malware',
      '07: Screenshot unauthorized activity',
      '08: Report to platform',
      '09: Inform contacts',
      '10: Document everything'
    ],
    evidence: [
      'Login attempt notifications',
      'Unauthorized posts/messages',
      'Changed account settings',
      'New devices logged in',
      'Password reset emails',
      'Communication with platform',
      'Timeline of compromise',
      'Any fraud committed'
    ],
    contacts: [
      'Platform support (email/social/bank)',
      '1930 - Cyber Crime Helpline',
      'Bank if financial account',
      'IT cell of local police'
    ],
    reporting: 'Report to the platform immediately. If fraud or identity theft involved, report at cybercrime.gov.in. For financial accounts, inform bank.',
    recovery: [
      'Regain account access',
      'Change all passwords',
      'Enable 2FA',
      'Review and remove unauthorized devices',
      'Check for data theft',
      'Monitor for identity misuse',
      'Inform contacts',
      'Review account settings',
      'Be alert for follow-up attacks'
    ],
    commonMistakes: [
      'Using same password everywhere',
      'Not enabling 2FA',
      'Ignoring security alerts',
      'Delaying password change',
      'Not checking logged-in devices',
      'Not informing contacts',
      'Not scanning for malware'
    ],
    example: {
      received: 'Email saying "Your Instagram password was changed"',
      claimed: 'If this wasn\'t you, click here to secure your account',
      warningSigns: ['Unexpected password change', 'Suspicious link', 'Urgency'],
      shouldDo: ['Go to Instagram directly', 'Use official app to recover', 'Change password', 'Enable 2FA']
    },
    quickChecklist: [
      'I use unique passwords',
      'I enable 2FA everywhere',
      'I check logged-in devices',
      'I act immediately on compromise',
      'I report account takeover'
    ],
    relatedFeatures: ['flashcards-account-takeover', 'incident-workspace', 'complaint-center'],
    sources: ['Platform Security Guidelines', 'CERT-In'],
    lastVerified: '2026-01'
  },
  {
    id: 'fake-customer-care',
    title: 'Fake Customer Care',
    category: 'social-engineering',
    description: 'Scammers pose as customer support to steal money or access accounts',
    whatIsIt: 'Scammers create fake customer care numbers or pose as support agents on social media. When you contact them for help, they steal your money, access your accounts, or install malware on your device.',
    howItHappens: [
      'You search for customer care number online',
      'Find fake number on fake website/forum',
      'Call thinking it\'s official support',
      'They ask for account details/"verify" identity',
      'Request remote access to "fix" problem',
      'Ask for OTP/payment to "process refund"',
      'Steal money or access accounts'
    ],
    warningSigns: [
      'Number found via Google search',
      'Asked for account password/OTP',
      'Request for remote access',
      'Promising instant refund',
      'Asking to download software',
      'Not on official website',
      'Generic email addresses',
      'Pressure to act quickly',
      'Asking for screen sharing'
    ],
    precautions: [
      'Use only numbers from official website/app',
      'Never search for customer care online',
      'Real support never asks for password',
      'Never give remote access',
      'Verify agent identity',
      'Use in-app chat support',
      'Check official social media for support',
      'Be suspicious of unsolicited calls'
    ],
    neverDo: [
      'Never use Google-searched numbers',
      'Never share password with support',
      'Never give remote access',
      'Never share OTP',
      'Never download software they suggest',
      'Never pay to get refund',
      'Never trust unsolicited support calls',
      'Never share screen with strangers'
    ],
    ifItHappens: [
      'Stop all communication',
      'Don\'t share more information',
      'Disconnect remote access if given',
      'Change all passwords immediately',
      'Scan device for malware',
      'Contact real company support',
      'Check accounts for unauthorized activity',
      'Report to cybercrime.gov.in',
      'Inform bank if financial details shared',
      'Document everything'
    ],
    firstTenMinutes: [
      '01: Stop communication immediately',
      '02: Disconnect any remote access',
      '03: Change all passwords',
      '04: Scan device for malware',
      '05: Contact real company support',
      '06: Check accounts for fraud',
      '07: If money lost, call bank',
      '08: Screenshot all evidence',
      '09: Report on cybercrime.gov.in',
      '10: Document timeline'
    ],
    evidence: [
      'Phone number called',
      'Call logs',
      'Screenshots of chats',
      'Remote access software installed',
      'Any payments made',
      'Account changes noticed',
      'Website where number found',
      'Date and time of contact'
    ],
    contacts: [
      'Real company support (from official app/website)',
      '1930 - Cyber Crime Helpline',
      'Bank if financial loss',
      'Device manufacturer if malware installed'
    ],
    reporting: 'Report at cybercrime.gov.in. Inform the real company about impersonation. If financial loss, inform bank immediately.',
    recovery: [
      'Change all passwords',
      'Scan and clean device',
      'Monitor all accounts',
      'Enable 2FA everywhere',
      'Review connected devices',
      'Be alert for follow-up scams',
      'Follow up on complaint',
      'Warn others about fake numbers'
    ],
    commonMistakes: [
      'Using Google-searched numbers',
      'Giving remote access',
      'Sharing password with "support"',
      'Paying to get refund',
      'Not verifying agent identity',
      'Downloading suggested software',
      'Trusting social media support'
    ],
    example: {
      received: 'Google search shows "SBI customer care: +91-98XXXXXXXX"',
      claimed: 'We can help recover your blocked account. Share OTP to verify.',
      warningSigns: ['Google-searched number', 'Asking for OTP', 'Not from official site'],
      shouldDo: ['Use number from SBI app/website', 'Never share OTP', 'Visit branch if needed', 'Report fake number']
    },
    quickChecklist: [
      'I use only official support numbers',
      'I never give remote access',
      'I never share password with support',
      'I verify support agent identity',
      'I report fake customer care'
    ],
    relatedFeatures: ['flashcards-social-engineering', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['Consumer Protection Guidelines', 'Company Official Websites'],
    lastVerified: '2026-01'
  },
  {
    id: 'sim-swap-fraud',
    title: 'SIM Swap Fraud',
    category: 'account',
    description: 'Scammers transfer your phone number to their SIM to intercept OTPs and access accounts',
    whatIsIt: 'Scammers convince your mobile operator to transfer your number to their SIM card. Once they have your number, they receive all your OTPs and can access your bank accounts and other services.',
    howItHappens: [
      'Scammer collects your personal information',
      'They contact your mobile operator',
      'Pose as you, request SIM swap',
      'Provide fake ID or use social engineering',
      'Your SIM gets deactivated',
      'Their SIM gets your number',
      'They receive all your OTPs',
      'Access your accounts and steal money'
    ],
    warningSigns: [
      'Sudden loss of mobile network',
      'SIM not working unexpectedly',
      'Unable to make/receive calls',
      'SMS not coming through',
      'Notification from operator about SIM change',
      'Unable to login to accounts',
      'Friends can\'t reach you'
    ],
    precautions: [
      'Set SIM swap PIN with operator',
      'Don\'t share personal details publicly',
      'Use app-based 2FA instead of SMS',
      'Monitor your mobile connection',
      'Contact operator immediately if SIM stops',
      'Keep operator details updated',
      'Use multiple recovery methods',
      'Be cautious of SIM swap attempts'
    ],
    neverDo: [
      'Never share SIM details with strangers',
      'Never ignore sudden network loss',
      'Never rely only on SMS for 2FA',
      'Never share personal info publicly',
      'Never delay reporting SIM issues',
      'Never skip SIM swap protection',
      'Never use weak SIM swap PIN'
    ],
    ifItHappens: [
      'Contact mobile operator immediately',
      'Inform bank about potential fraud',
      'Change passwords using alternative device',
      'Check all accounts for unauthorized access',
      'Report to cybercrime.gov.in',
      'File police complaint',
      'Get replacement SIM',
      'Review all account security',
      'Monitor financial transactions',
      'Document everything'
    ],
    firstTenMinutes: [
      '01: Call mobile operator immediately',
      '02: Inform bank of potential fraud',
      '03: Use another device to change passwords',
      '04: Check accounts for unauthorized access',
      '05: Report on cybercrime.gov.in',
      '06: Contact bank fraud department',
      '07: Screenshot all evidence',
      '08: Note time of SIM failure',
      '09: Inform contacts about situation',
      '10: Document timeline'
    ],
    evidence: [
      'Time SIM stopped working',
      'Operator communication',
      'Bank transaction alerts',
      'Account access issues',
      'Call logs showing network loss',
      'Any unauthorized transactions',
      'Operator confirmation of swap',
      'Police complaint details'
    ],
    contacts: [
      'Mobile operator customer care',
      'Bank fraud department',
      '1930 - Cyber Crime Helpline',
      'Local police for FIR'
    ],
    reporting: 'Report to mobile operator immediately. Inform bank. Report at cybercrime.gov.in. File FIR with police. This is serious fraud requiring immediate action.',
    recovery: [
      'Get replacement SIM',
      'Change all passwords',
      'Enable app-based 2FA',
      'Monitor all accounts',
      'Review financial transactions',
      'Set up SIM swap protection',
      'Be alert for follow-up attempts',
      'Follow up on complaints',
      'Consider credit monitoring'
    ],
    commonMistakes: [
      'Not setting SIM swap PIN',
      'Delaying reporting of SIM issues',
      'Relying only on SMS 2FA',
      'Sharing personal info publicly',
      'Not informing bank immediately',
      'Not checking accounts promptly',
      'Using weak SIM swap protection'
    ],
    example: {
      received: 'Phone suddenly shows "No Service" unexpectedly',
      claimed: 'Scammer has swapped your SIM to receive OTPs',
      warningSigns: ['Sudden network loss', 'SIM not working', 'No calls/SMS'],
      shouldDo: ['Call operator immediately', 'Inform bank', 'Change passwords', 'Report fraud']
    },
    quickChecklist: [
      'I have SIM swap protection',
      'I use app-based 2FA',
      'I report SIM issues immediately',
      'I inform bank of SIM fraud',
      'I monitor accounts closely'
    ],
    relatedFeatures: ['flashcards-account-takeover', 'incident-workspace', 'complaint-center'],
    sources: ['Telecom Regulatory Authority', 'Banking Security Guidelines'],
    lastVerified: '2026-01'
  },
  {
    id: 'romance-scam',
    title: 'Romance Scam',
    category: 'social-engineering',
    description: 'Fake romantic relationships built to manipulate victims into sending money',
    whatIsIt: 'Scammers create fake profiles on dating apps or social media, build emotional relationships over time, then exploit trust to request money for fake emergencies, investments, or travel.',
    howItHappens: [
      'Create attractive fake profile',
      'Match with victim on dating app',
      'Build emotional connection over weeks/months',
      'Share fake life stories and photos',
      'Create emergency (medical, travel, business)',
      'Request money for "help"',
      'Victim sends money out of love/concern',
      'Continue requesting more money',
      'Eventually disappear'
    ],
    warningSigns: [
      'Too perfect profile',
      'Quick emotional attachment',
      'Never meeting in person',
      'Always has excuses for video calls',
      'Requests for money',
      'Emergency situations',
      'Asking for financial help',
      'Stories that don\'t add up',
      'Professional photos (stolen)',
      'Avoiding meeting family/friends'
    ],
    precautions: [
      'Never send money to online relationships',
      'Video call to verify identity',
      'Meet in person before emotional investment',
      'Reverse image search their photos',
      'Be suspicious of quick love',
      'Don\'t share financial information',
      'Talk to friends/family about relationship',
      'Research their story'
    ],
    neverDo: [
      'Never send money to online partner',
      'Never share financial details',
      'Never ignore red flags for love',
      'Never skip video verification',
      'Never keep relationship secret',
      'Never invest in their "business"',
      'Never pay for their "travel"',
      'Never believe emergency stories without proof'
    ],
    ifItHappens: [
      'Stop all communication',
      'Don\'t send more money',
      'Screenshot everything',
      'Report on dating platform',
      'Report to cybercrime.gov.in',
      'Inform bank if accounts compromised',
      'Talk to trusted friends/family',
      'File police complaint',
      'Check for identity theft',
      'Seek emotional support'
    ],
    firstTenMinutes: [
      '01: Stop communication immediately',
      '02: Don\'t send any more money',
      '03: Screenshot all conversations',
      '04: Save their profile details',
      '05: Report on dating platform',
      '06: Report on cybercrime.gov.in',
      '07: Check financial accounts',
      '08: Inform trusted person',
      '09: Document everything',
      '10: Seek support'
    ],
    evidence: [
      'All chat conversations',
      'Profile screenshots',
      'Photos they shared',
      'Money transfer records',
      'Their contact details',
      'Stories and excuses given',
      'Platform where met',
      'Timeline of relationship'
    ],
    contacts: [
      'Dating platform support',
      '1930 - Cyber Crime Helpline',
      'Bank if financial loss',
      'Local police for FIR',
      'Counseling support if needed'
    ],
    reporting: 'Report on the dating platform and cybercrime.gov.in. File police complaint. If money sent, inform bank. This is emotional and financial fraud.',
    recovery: [
      'Block all communication',
      'Monitor financial accounts',
      'Change passwords if shared',
      'Seek emotional support',
      'Be alert for follow-up scams',
      'Learn warning signs',
      'Talk to trusted people',
      'Follow up on complaints',
      'Consider counseling'
    ],
    commonMistakes: [
      'Sending money out of love',
      'Ignoring red flags',
      'Not verifying identity',
      'Keeping relationship secret',
      'Believing emergency stories',
      'Sending more to "help"',
      'Not talking to friends/family',
      'Trusting too quickly'
    ],
    example: {
      received: 'Match on dating app, quick emotional connection, claims to be working abroad',
      claimed: 'Need ₹50,000 for medical emergency, will repay when back',
      warningSigns: ['Quick attachment', 'Money request', 'Never met', 'Emergency story'],
      shouldDo: ['Never send money', 'Video call to verify', 'Talk to friends', 'Report suspicious profile']
    },
    quickChecklist: [
      'I never send money to online partners',
      'I verify identity through video',
      'I talk to friends about relationships',
      'I recognize romance scam signs',
      'I report fake profiles'
    ],
    relatedFeatures: ['flashcards-social-engineering', 'scam-arena', 'incident-workspace', 'complaint-center'],
    sources: ['Cyber Crime Research', 'Consumer Protection'],
    lastVerified: '2026-01'
  }
];

export const EMERGENCY_CONTACTS = [
  {
    name: 'National Cyber Crime Helpline',
    number: '1930',
    purpose: 'Report cyber crime and financial fraud',
    source: 'Ministry of Home Affairs, Government of India',
    lastVerified: '2026-01'
  },
  {
    name: 'National Emergency Number',
    number: '112',
    purpose: 'Immediate emergency assistance',
    source: 'Government of India',
    lastVerified: '2026-01'
  },
  {
    name: 'Cyber Crime Reporting Portal',
    number: 'Online',
    purpose: 'File cyber crime complaints online',
    source: 'https://cybercrime.gov.in',
    lastVerified: '2026-01',
    url: 'https://cybercrime.gov.in'
  }
];

export const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'financial', label: 'Financial' },
  { key: 'account', label: 'Account' },
  { key: 'social-engineering', label: 'Social Engineering' },
  { key: 'online-privacy', label: 'Online & Privacy' }
];
