// AI Assistant Integration
// WARNING: API keys should never be exposed in frontend code in production.
// This is for demonstration purposes only.

const API_KEY = 'sk-orv1-b5e962f0e150155c9aafb74e99b0d83ca4aed984c7b231faff8ec7777dfc77b9';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function askAI(messages: AIMessage[]): Promise<string> {
  try {
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
            content: 'You are Alpha Safe AI Assistant, a cybersecurity safety helper. You help users understand cyber threats, analyze suspicious messages and URLs, and provide guidance on staying safe online. Be concise, clear, and actionable. Never provide fake information. If you are unsure, say so.'
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'AI response unavailable.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'AI analysis unavailable — the AI service could not be reached. Please try again later or use the built-in analysis tools.';
  }
}

export async function explainThreat(urlOrMessage: string, type: 'url' | 'message'): Promise<string> {
  const prompt = type === 'url'
    ? `Explain this URL in simple terms for a non-technical user. Is it suspicious? What should they do?\n\nURL: ${urlOrMessage}`
    : `Analyze this message for scam indicators. Explain in simple terms what red flags exist and what the user should do.\n\nMessage: ${urlOrMessage}`;

  return askAI([{ role: 'user', content: prompt }]);
}

export async function suggestActions(context: string): Promise<string> {
  const prompt = `Based on this cyber safety situation, suggest 1-3 immediate actions the user should take. Be specific and actionable.\n\nSituation: ${context}`;
  return askAI([{ role: 'user', content: prompt }]);
}
