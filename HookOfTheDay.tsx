import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Copy, Heart } from 'lucide-react';
import { Hook } from '../types';

const HookOfTheDay: React.FC = () => {
  const [todaysHook, setTodaysHook] = useState<Hook | null>(null);

  useEffect(() => {
    // Generate hook of the day based on current date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    const dailyHooks = [
      "The secret to viral content? It's not what you think.",
      "Why 99% of creators fail (and how to be the 1%)",
      "This one mindset shift changed everything for me",
      "The algorithm hack nobody talks about",
      "Stop creating content. Start creating conversations.",
      "Your biggest competitor isn't who you think it is",
      "The content strategy that built my 6-figure business",
      "Why authenticity is overrated (controversial take)",
      "The psychology behind viral hooks revealed",
      "This free tool replaced my entire marketing team"
    ];

    const hookText = dailyHooks[dayOfYear % dailyHooks.length];
    
    setTodaysHook({
      id: `daily-${today.toDateString()}`,
      text: hookText,
      topic: 'Daily Inspiration',
      category: 'Featured',
      createdAt: today,
      engagement: 95
    });
  }, []);

  const copyHook = () => {
    if (todaysHook) {
      navigator.clipboard.writeText(todaysHook.text);
    }
  };

  if (!todaysHook) return null;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-black rounded-xl">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-black">Hook of the Day</h3>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
        <p className="text-lg font-medium text-gray-800 leading-relaxed mb-3">
          {todaysHook.text}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{todaysHook.engagement}% engagement</span>
            </div>
            <span className="px-2 py-1 bg-gray-100 rounded-md">{todaysHook.category}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyHook}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Copy hook"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Add to favorites"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        ✨ A new hook is featured every day to inspire your content creation
      </p>
    </div>
  );
};

export default HookOfTheDay;