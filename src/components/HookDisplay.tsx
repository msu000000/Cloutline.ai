import React from 'react';
import { Copy, Heart, Share2, TrendingUp } from 'lucide-react';
import { Hook } from '../types';

interface HookDisplayProps {
  hooks: Hook[];
  favorites: Hook[];
  onCopy: (text: string) => void;
  onToggleFavorite: (hook: Hook) => void;
  onShare: (hook: Hook) => void;
  isLoading: boolean;
}

const HookDisplay: React.FC<HookDisplayProps> = ({
  hooks,
  favorites,
  onCopy,
  onToggleFavorite,
  onShare,
  isLoading
}) => {
  const isFavorited = (hookId: string) => {
    return favorites.some(fav => fav.id === hookId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>AI is crafting your hooks...</span>
          </div>
        </div>
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-2 ml-4">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hooks.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Your AI-Generated Hooks</h3>
        <p className="text-gray-600">5 unique hooks ready to boost your content engagement</p>
      </div>

      <div className="grid gap-4">
        {hooks.map((hook, index) => (
          <div
            key={hook.id}
            className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-black transition-all duration-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-lg text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">{hook.category}</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{hook.engagement}% engagement</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg font-medium text-black leading-relaxed group-hover:text-gray-900 transition-colors">
                  {hook.text}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onCopy(hook.text)}
                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Copy hook"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onToggleFavorite(hook)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isFavorited(hook.id)
                      ? 'text-red-500 hover:text-red-600 bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                  }`}
                  title={isFavorited(hook.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited(hook.id) ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => onShare(hook)}
                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Share hook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={() => hooks.forEach(hook => onCopy(hook.text))}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Copy All</span>
        </button>
        
        <button
          onClick={() => {
            const allText = hooks.map((hook, i) => `${i + 1}. ${hook.text}`).join('\n\n');
            const blob = new Blob([allText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cloutline-hooks-${Date.now()}.txt`;
            a.click();
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span>📄</span>
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default HookDisplay;
