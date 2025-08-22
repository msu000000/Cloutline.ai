// Check if we're in development and log API key status
const isDev = import.meta.env.DEV;
if (isDev) {
  console.log('Groq API Key present:', !!import.meta.env.VITE_GROQ_API_KEY);
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GenerationOptions {
  style: string;
  platform: string;
  audience: string;
  tone: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  maxLength: number;
}

export class GroqService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.groq.com/openai/v1';
  }

  async generateHooks(topic: string, options: GenerationOptions): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured');
    }

    if (!topic || topic.trim().length === 0) {
      throw new Error('Topic is required for hook generation');
    }

    const prompt = this.buildPrompt(topic, options);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are an expert content creator and marketing specialist who creates viral, engaging hooks for social media content. Generate exactly 5 unique, attention-grabbing hooks that are designed to maximize engagement and click-through rates. Return only the hooks, numbered 1-5, one per line.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 500,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      return this.parseHooks(content);
    } catch (error) {
      console.error('Groq API Error Details:', error);
      throw error;
    }
  }

  private buildPrompt(topic: string, options: GenerationOptions): string {
    const { style, platform, audience, tone, includeEmojis, includeHashtags, maxLength } = options;

    let prompt = `Create 5 unique, ${style} social media hooks about "${topic}" optimized for ${platform}.

Target audience: ${audience}
Tone: ${tone}
Max length per hook: ${maxLength} characters
${includeEmojis ? 'Include relevant emojis' : 'No emojis'}
${includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}

Make each hook:
- Unique and engaging
- ${style} in style
- Under ${maxLength} characters
- Optimized for ${platform}

Format: Number each hook 1-5, one per line.

Generate 5 ${style} hooks about "${topic}":`;

    return prompt;
  }

  private parseHooks(content: string): string[] {
    const lines = content.split('\n').filter(line => line.trim());
    const hooks: string[] = [];

    for (const line of lines) {
      // Remove numbering and clean up
      const cleaned = line.replace(/^\d+\.?\s*/, '').trim();
      if (cleaned && cleaned.length > 10) {
        hooks.push(cleaned);
      }
    }

    // Ensure we have exactly 5 hooks
    if (hooks.length < 5) {
      // Fallback: generate additional hooks if needed
      const fallbackHooks = [
        `The ${topic} secret that changed everything`,
        `Why everyone's wrong about ${topic}`,
        `This ${topic} hack will blow your mind`,
        `The truth about ${topic} nobody tells you`,
        `How I mastered ${topic} in record time`
      ];
      
      while (hooks.length < 5) {
        hooks.push(fallbackHooks[hooks.length] || `Amazing ${topic} insight #${hooks.length + 1}`);
      }
    }

    return hooks.slice(0, 5);
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 1
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getUsage(): Promise<{ requests: number; tokens: number } | null> {
    // This would typically call a usage endpoint
    // For now, return mock data
    return {
      requests: Math.floor(Math.random() * 1000),
      tokens: Math.floor(Math.random() * 50000)
    };
  }
}

export const groqService = new GroqService();
