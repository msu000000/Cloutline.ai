// Professional Groq API Service with comprehensive error handling
const isDev = import.meta.env.DEV;

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.groq.com/openai/v1';
    this.model = 'llama3-8b-8192';
    
    if (isDev && !this.apiKey) {
      console.warn('⚠️ Groq API key not found. Please add VITE_GROQ_API_KEY to your .env file');
    }
  }

  async generateHooks(topic: string, options: GenerationOptions): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('Groq API key is required. Please check your environment configuration.');
    }

    if (!topic || topic.trim().length === 0) {
      throw new Error('Topic is required for hook generation');
    }

    if (topic.trim().length < 2) {
      throw new Error('Topic must be at least 2 characters long');
    }

    const prompt = this.buildAdvancedPrompt(topic, options);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(options)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          max_tokens: 800,
          top_p: 0.95,
          frequency_penalty: 0.3,
          presence_penalty: 0.2,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Groq API key configuration.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else if (response.status === 400) {
          throw new Error(`Invalid request: ${errorMessage}`);
        } else {
          throw new Error(`API Error: ${errorMessage}`);
        }
      }

      const data: GroqResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated. Please try again.');
      }

      const content = data.choices[0]?.message?.content || '';
      
      if (!content.trim()) {
        throw new Error('Empty response received. Please try again.');
      }

      const hooks = this.parseHooks(content);
      
      if (hooks.length === 0) {
        throw new Error('Failed to parse hooks from response. Please try again.');
      }

      return hooks;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred. Please check your connection and try again.');
    }
  }

  private getSystemPrompt(options: GenerationOptions): string {
    return `You are an expert viral content creator and marketing strategist with deep knowledge of social media psychology and engagement patterns.

Your expertise includes:
- Understanding what makes content go viral across different platforms
- Psychology of attention-grabbing headlines and hooks
- Platform-specific optimization (${options.platform})
- Audience targeting for ${options.audience}
- ${options.style} content creation

Generate exactly 5 unique, high-converting hooks that are:
- Optimized for ${options.platform}
- Written in a ${options.tone} tone
- Targeted at ${options.audience}
- Following ${options.style} style guidelines
- Under ${options.maxLength} characters each
${options.includeEmojis ? '- Enhanced with relevant emojis' : '- Without emojis'}
${options.includeHashtags ? '- Including strategic hashtags' : '- Without hashtags'}

Format: Return only the hooks, numbered 1-5, one per line. No additional text or explanations.`;
  }

  private buildAdvancedPrompt(topic: string, options: GenerationOptions): string {
    const styleInstructions = {
      viral: 'Create hooks that are shocking, controversial, or extremely compelling. Use power words and emotional triggers.',
      professional: 'Create authoritative, credible hooks that establish expertise and trust. Focus on value and results.',
      casual: 'Create friendly, conversational hooks that feel personal and relatable. Use everyday language.',
      controversial: 'Create bold, debate-sparking hooks that challenge common beliefs. Be provocative but not offensive.',
      educational: 'Create informative hooks that promise valuable learning. Focus on insights and knowledge sharing.'
    };

    const platformInstructions = {
      twitter: 'Optimize for Twitter/X with concise, punchy language. Consider thread potential.',
      linkedin: 'Professional tone suitable for business networking. Focus on career and business value.',
      instagram: 'Visual-first thinking with lifestyle appeal. Consider story potential.',
      tiktok: 'Trend-aware with youth appeal. Consider video content potential.',
      youtube: 'Title-optimized for search and click-through. Consider thumbnail appeal.',
      general: 'Versatile hooks that work across multiple platforms.'
    };

    return `Topic: "${topic}"

Style Guidelines: ${styleInstructions[options.style as keyof typeof styleInstructions] || styleInstructions.viral}

Platform Focus: ${platformInstructions[options.platform as keyof typeof platformInstructions] || platformInstructions.general}

Create 5 ${options.style} hooks about "${topic}" that will maximize engagement and drive action.`;
  }

  private parseHooks(content: string): string[] {
    const lines = content.split('\n').filter(line => line.trim());
    const hooks: string[] = [];

    for (const line of lines) {
      // Remove numbering and clean up
      const cleaned = line.replace(/^\d+\.?\s*/, '').replace(/^[-•]\s*/, '').trim();
      if (cleaned && cleaned.length > 10 && cleaned.length < 500) {
        hooks.push(cleaned);
      }
    }

    // Ensure we have exactly 5 hooks
    while (hooks.length < 5 && hooks.length > 0) {
      // Duplicate and modify existing hooks if we don't have enough
      const baseHook = hooks[hooks.length % hooks.length];
      const variations = [
        baseHook.replace(/\?$/, ' (you need to see this)'),
        baseHook.replace(/\.$/, ' - here\'s why'),
        baseHook + ' 🔥',
        'BREAKING: ' + baseHook.toLowerCase(),
        baseHook.replace(/^/, 'The truth about ')
      ];
      hooks.push(variations[hooks.length - 1] || baseHook);
    }

    return hooks.slice(0, 5);
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
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
    // Mock usage data - in a real app, this would call a usage endpoint
    return {
      requests: Math.floor(Math.random() * 1000) + 100,
      tokens: Math.floor(Math.random() * 50000) + 10000
    };
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const groqService = new GroqService();
