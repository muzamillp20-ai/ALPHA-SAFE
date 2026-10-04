// AI Assistant Integration
// WARNING: API keys should never be exposed in frontend code in production.
// For production deployment, use a backend proxy service.

const API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Knowledge base for offline fallback responses
const knowledgeBase: Record<string, string> = {
  'phishing': `**Phishing Awareness**

Phishing involves deceptive messages designed to trick you into revealing sensitive information.

**Warning Signs:**
• Urgent or threatening language
• Requests for passwords, OTPs, or personal info
• Suspicious sender addresses
• Links that don't match the claimed source
• Grammar errors in "official" messages

**What to Do:**
1. Don't click any links
2. Verify directly with the organization through official channels
3. Report the message as spam/phishing
4. Delete the message

**Remember:** Legitimate organizations never ask for passwords or OTPs via email or message.`,

  'otp': `**OTP Safety**

One-Time Passwords (OTPs) are secure verification codes. Never share them with anyone.

**Important Rules:**
• Never share your OTP with anyone, even if they claim to be from your bank
• Banks and services NEVER ask for OTPs over phone or message
• If you receive an unexpected OTP, ignore it
• OTPs are only for YOUR verification

**If You Shared an OTP:**
1. Contact your bank immediately
2. Change your password
3. Monitor your accounts for unauthorized activity
4. Report to cybercrime.gov.in

**Remember:** No legitimate organization will ever ask for your OTP.`,

  'password': `**Password Security**

Strong passwords are your first line of defense.

**Best Practices:**
• Use unique passwords for each account
• Make passwords at least 12 characters long
• Mix uppercase, lowercase, numbers, and symbols
• Use a password manager
• Enable two-factor authentication (2FA)

**What NOT to Do:**
• Don't reuse passwords across accounts
• Don't share passwords with anyone
• Don't write passwords in plain text
• Don't use personal information (birthdays, names)

**If Compromised:**
1. Change the password immediately
2. Check for unauthorized activity
3. Enable 2FA if not already active
4. Update passwords on other accounts if reused`,

  'url': `**URL Safety**

Suspicious URLs can lead to malicious websites.

**How to Check:**
• Look for HTTPS (padlock icon)
• Check the domain name carefully
• Watch for misspellings (g00gle instead of google)
• Be wary of URL shorteners
• Hover over links to see actual destination

**Red Flags:**
• Strange domain names
• HTTP instead of HTTPS
• URLs with many subdomains
• Suspicious characters or encoding
• Links in unsolicited messages

**What to Do:**
1. Don't click suspicious links
2. Type the website address directly
3. Use the built-in URL analyzer in ALPHA SAFE
4. Report suspicious URLs`,

  'scam': `**Scam Recognition**

Scammers use various tactics to deceive people.

**Common Tactics:**
• Creating false urgency
• Impersonating trusted organizations
• Promising unrealistic rewards
• Threatening negative consequences
• Requesting immediate action

**Warning Signs:**
• Too good to be true offers
• Requests for personal information
• Pressure to act immediately
• Unusual payment methods
• Poor grammar in "official" communications

**Protection:**
1. Take time to think before acting
2. Verify through official channels
3. Never send money to unknown parties
4. Report suspicious contacts

**Remember:** If it feels wrong, it probably is.`,

  'report': `**How to Report Cyber Incidents**

**National Cyber Crime Portal:**
• Website: cybercrime.gov.in
• Helpline: 1930
• For: All types of cyber crimes

**Financial Fraud:**
• Contact your bank immediately
• Call 1930 (Cyber Crime Helpline)
• Report within the "golden hour" for better recovery chances

**What to Document:**
• Screenshots of messages/emails
• Transaction details
• Phone numbers involved
• Dates and times
• Any URLs or links

**ALPHA SAFE Tools:**
• Use Incident Workspace to document
• Evidence Vault to store proof
• Complaint Practice Center to prepare drafts

**Important:** ALPHA SAFE helps you prepare documentation. Official complaints must be filed through government portals.`,

  'safety': `**Online Safety Best Practices**

**Account Security:**
• Use strong, unique passwords
• Enable two-factor authentication
• Review account activity regularly
• Keep recovery options updated

**Browsing Safety:**
• Use HTTPS websites only
• Keep browsers and software updated
• Be cautious with downloads
• Don't click suspicious links

**Communication Safety:**
• Verify sender identity
• Don't share sensitive information
• Be wary of unsolicited contacts
• Report suspicious messages

**Device Safety:**
• Install apps only from official stores
• Review app permissions
• Keep operating system updated
• Use security software

**General Tips:**
• Think before you click
• When in doubt, don't proceed
• Verify through official channels
• Report suspicious activity`
};

// Pattern matching for fallback responses
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for keywords and return relevant knowledge base entry
  if (lowerMessage.includes('phishing') || lowerMessage.includes('email') || lowerMessage.includes('fake')) {
    return knowledgeBase['phishing'];
  }
  if (lowerMessage.includes('otp') || lowerMessage.includes('one time') || lowerMessage.includes('verification code')) {
    return knowledgeBase['otp'];
  }
  if (lowerMessage.includes('password') || lowerMessage.includes('credential') || lowerMessage.includes('login')) {
    return knowledgeBase['password'];
  }
  if (lowerMessage.includes('url') || lowerMessage.includes('link') || lowerMessage.includes('website')) {
    return knowledgeBase['url'];
  }
  if (lowerMessage.includes('scam') || lowerMessage.includes('fraud') || lowerMessage.includes('suspicious')) {
    return knowledgeBase['scam'];
  }
  if (lowerMessage.includes('report') || lowerMessage.includes('complaint') || lowerMessage.includes('file')) {
    return knowledgeBase['report'];
  }
  if (lowerMessage.includes('safe') || lowerMessage.includes('protect') || lowerMessage.includes('security')) {
    return knowledgeBase['safety'];
  }
  
  // Default response
  return `I can help you with cybersecurity safety topics. Here are some areas I can assist with:

• **Phishing** - How to identify and avoid deceptive messages
• **OTP Safety** - Protecting your verification codes
• **Password Security** - Creating and managing strong passwords
• **URL Safety** - Recognizing suspicious links
• **Scam Recognition** - Identifying common fraud tactics
• **Reporting** - How to report cyber incidents
• **General Safety** - Best practices for online security

Please ask about any of these topics, or use the built-in tools in ALPHA SAFE for:
• URL analysis (Investigate section)
• Message analysis (Investigate section)
• Learning modules (Learn section)
• Safety Center for comprehensive guides

How can I help you stay safe online?`;
}

function getDefaultResponse(): string {
  return `I can help you with cybersecurity safety topics. Here are some areas I can assist with:

• **Phishing** - How to identify and avoid deceptive messages
• **OTP Safety** - Protecting your verification codes
• **Password Security** - Creating and managing strong passwords
• **URL Safety** - Recognizing suspicious links
• **Scam Recognition** - Identifying common fraud tactics
• **Reporting** - How to report cyber incidents
• **General Safety** - Best practices for online security

Please ask about any of these topics, or use the built-in tools in ALPHA SAFE for:
• URL analysis (Investigate section)
• Message analysis (Investigate section)
• Learning modules (Learn section)
• Safety Center for comprehensive guides

How can I help you stay safe online?`;
}

export async function askAI(messages: AIMessage[]): Promise<string> {
  // Get the last user message for knowledge base matching
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.role === 'user' ? lastMessage.content : '';
  
  // ALWAYS use knowledge base for cybersecurity topics
  // This ensures reliable, helpful responses without API dependency
  const knowledgeBaseResponse = getFallbackResponse(userMessage);
  
  // If we have a knowledge base match, use it immediately
  if (knowledgeBaseResponse !== getDefaultResponse()) {
    return knowledgeBaseResponse;
  }
  
  // If no API key is configured, return default response
  if (!API_KEY) {
    console.log('AI API key not configured, using default response');
    return getDefaultResponse();
  }
  
  // For general questions, try API as enhancement (with full error handling)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are ALPHA SAFE Assistant, an educational cybersecurity guide. Help users understand online safety, recognize common threats like phishing and fraud, and learn protective measures. Focus on defensive security education and user awareness. Provide practical, actionable advice for staying safe online.'
          },
          ...messages
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log('API returned error, using default response');
      return getDefaultResponse();
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return getDefaultResponse();
    }
    
    return content;
  } catch (error) {
    // Any error (network, timeout, content filter, etc.) - use default
    console.log('API unavailable, using default response');
    return getDefaultResponse();
  }
}

export async function explainThreat(urlOrMessage: string, type: 'url' | 'message'): Promise<string> {
  const prompt = type === 'url'
    ? `I need help understanding if this URL is safe. Please explain in simple terms what you notice about it and what I should do:\n\nURL: ${urlOrMessage}\n\nPlease focus on safety education and practical advice.`
    : `I received this message and I'm concerned it might be a scam. Can you help me understand the warning signs and what I should do?\n\nMessage: ${urlOrMessage}\n\nPlease focus on safety education and practical advice.`;

  return askAI([{ role: 'user', content: prompt }]);
}

export async function suggestActions(context: string): Promise<string> {
  const prompt = `I need safety guidance for this situation. Can you suggest 1-3 immediate actions I should take to stay safe?\n\nSituation: ${context}\n\nPlease provide clear, actionable safety advice.`;
  return askAI([{ role: 'user', content: prompt }]);
}
