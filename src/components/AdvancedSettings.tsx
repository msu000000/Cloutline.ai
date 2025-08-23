import React, { useState, useEffect } from 'react';
import { Settings, Zap, Globe, Users, Palette, Key, TestTube } from 'lucide-react';
import { groqService } from '../services/groqApi';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [usage, setUsage] = useState<{ requests: number; tokens: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkApiStatus();
      loadUsage();
    }
  }, [isOpen]);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      const isConnected = await groqService.testConnection();
      setApiStatus(isConnected ? 'connected' : 'disconnected');
    } catch {
      setApiStatus('disconnected');
    }
  };

  const loadUsage = async () => {
    try {
      const usageData = await groqService.getUsage();
      setUsage(usageData);
    } catch {
      setUsage(null);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-bold">Advanced Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-8">

            {/* Generation Style */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h4 className="text-lg font-semibold">Generation Style</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pl-7">
                {[
                  { value: 'viral', label: 'Viral', desc: 'Maximum engagement' },
                  { value: 'professional', label: 'Professional', desc: 'Business-focused' },
                  { value: 'casual', label: 'Casual', desc: 'Friendly tone' },
                  { value: 'controversial', label: 'Controversial', desc: 'Bold statements' },
                  { value: 'educational', label: 'Educational', desc: 'Informative content' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleSettingChange('style', style.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      settings.style === style.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs opacity-75">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Targeting */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold">Platform Targeting</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-3 pl-7">
                {[
                  { value: 'twitter', label: 'Twitter/X', icon: '𝕏' },
                  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
                  { value: 'instagram', label: 'Instagram', icon: '📸' },
                  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
                  { value: 'youtube', label: 'YouTube', icon: '📺' },
                  { value: 'general', label: 'General', icon: '🌐' }
                ].map((platform) => (
                  <button
                    key={platform.value}
                    onClick={() => handleSettingChange('platform', platform.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      settings.platform === platform.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{platform.icon}</div>
                    <div className="text-xs">{platform.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audience Targeting */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-orange-600" />
                <h4 className="text-lg font-semibold">Audience Targeting</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pl-7">
                {[
                  { value: 'general', label: 'General Audience' },
                  { value: 'business', label: 'Business Professionals' },
                  { value: 'creators', label: 'Content Creators' },
                  { value: 'students', label: 'Students & Learners' },
                  { value: 'entrepreneurs', label: 'Entrepreneurs' }
                ].map((audience) => (
                  <button
                    key={audience.value}
                    onClick={() => handleSettingChange('audience', audience.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      settings.audience === audience.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{audience.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TestTube className="w-5 h-5 text-red-600" />
                <h4 className="text-lg font-semibold">Advanced Options</h4>
              </div>
              
              <div className="space-y-4 pl-7">
                <label className="flex items-center justify-between">
                  <span>Include Emojis</span>
                  <input
                    type="checkbox"
                    checked={settings.includeEmojis}
                    onChange={(e) => handleSettingChange('includeEmojis', e.target.checked)}
                    className="rounded"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span>Include Hashtags</span>
                  <input
                    type="checkbox"
                    checked={settings.includeHashtags}
                    onChange={(e) => handleSettingChange('includeHashtags', e.target.checked)}
                    className="rounded"
                  />
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Length: {settings.maxLength} characters
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    value={settings.maxLength}
                    onChange={(e) => handleSettingChange('maxLength', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <select
                    value={settings.tone}
                    onChange={(e) => handleSettingChange('tone', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="humorous">Humorous</option>
                    <option value="inspiring">Inspiring</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Settings are saved automatically
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
