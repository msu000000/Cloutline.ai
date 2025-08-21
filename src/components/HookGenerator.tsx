import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateHooksWithAI } from '../services/hookGenerator'; // Make sure path is correct

interface HookGeneratorProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  hasHooks: boolean;
}

const HookGenerator: React.FC<HookGeneratorProps> = ({
  topic,
  onTopicChange,
  onGenerate,
  onRefresh,
  isLoading,
  hasHooks
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hooks, setHooks] = useState<string[]>([]); // <-- AI hooks state

  // Generate hooks using Groq AI
  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      onGenerate(); // notify parent loading started

      const aiHooks = await generateHooksWithAI(topic, {
        style: 'curiosity',
        platform: 'YouTube',
        audience: 'beginners',
        tone: 'exciting',
        includeEmojis: true,
        includeHashtags: true,
        maxLength: 100,
        useGroqAPI: true
      });

      setHooks(aiHooks.map(h => h.text)); // Save only text
    } catch (err) {
      console.error('AI hook generation failed:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Generate Viral Hooks
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Enter any topic and get 5 attention-grabbing hooks powered by AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your topic (e.g., fitness, entrepreneurship, cooking...)"
            className={`w-full px-6 py-4 text-lg border-2 rounded-xl bg-white transition-all duration-300 placeholder-gray-400 focus:outline-none ${
              isFocused || topic 
                ? 'border-black' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            disabled={isLoading}
          />
          
          {topic && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              !topic.trim() || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Hooks</span>
              </>
            )}
          </button>

          {hasHooks && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="sm:w-auto w-full flex items-center justify-center space-x-2 py-4 px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-black hover:text-black transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>
      </form>

      {/* Quick Topics */}
      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-3">Quick start:</p>
        <div className="flex flex-wrap gap-2">
          {['Business Growth', 'Fitness Tips', 'Cooking Hacks', 'Tech Trends', 'Personal Finance'].map((quickTopic) => (
            <button
              key={quickTopic}
              onClick={() => onTopicChange(quickTopic)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200"
              disabled={isLoading}
            >
              {quickTopic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HookGenerator;
