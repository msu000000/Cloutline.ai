import React from 'react';
import { X } from 'lucide-react';
import { Hook, SharePlatform } from '../types';

interface SocialShareProps {
  hook: Hook | null;
  isOpen: boolean;
  onClose: () => void;
}

const SocialShare: React.FC<SocialShareProps> = ({ hook, isOpen, onClose }) => {
  const platforms: SharePlatform[] = [
   {
      name: 'YouTube',
      icon: 'Youtube', 
      color: 'bg-red-600',
      url: (text: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(text)}`
    }, 
    {
      name: 'Twitter/X',
      icon: '𝕏',
      color: 'bg-black',
      url: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + '\n\nGenerated with @Cloutline')}`
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      color: 'bg-blue-600',
      url: (text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://cloutline.app')}&summary=${encodeURIComponent(text)}`
    },
    {
      name: 'Facebook',
      icon: 'f',
      color: 'bg-blue-500',
      url: (text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://cloutline.app')}&quote=${encodeURIComponent(text)}`
    },
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-green-500',
      url: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-400',
      url: (text) => `https://t.me/share/url?url=${encodeURIComponent('https://cloutline.app')}&text=${encodeURIComponent(text)}`
    },
    {
      name: 'Reddit',
      icon: '🔴',
      color: 'bg-orange-500',
      url: (text) => `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent('https://cloutline.app')}`
  }
  ];

  const handleShare = (platform: SharePlatform) => {
    if (!hook) return;
    
    const url = platform.url(hook.text);
    window.open(url, '_blank', 'width=600,height=400');
    onClose();
  };

  const copyToClipboard = () => {
    if (hook) {
      navigator.clipboard.writeText(hook.text);
      onClose();
    }
  };

  if (!isOpen || !hook) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Share Hook</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-black">
            <p className="text-gray-800 font-medium">{hook.text}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`w-full flex items-center space-x-3 p-3 ${platform.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
            >
              <span className="text-xl">{platform.icon}</span>
              <span className="font-medium">Share on {platform.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-black hover:text-black transition-all duration-300"
        >
          <span>📋</span>
          <span>Copy to Clipboard</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
