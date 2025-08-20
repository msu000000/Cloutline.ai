import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HookGenerator from './components/HookGenerator';
import HookDisplay from './components/HookDisplay';
import HookOfTheDay from './components/HookOfTheDay';
import SocialShare from './components/SocialShare';
import UserStats from './components/UserStats';
import Favorites from './components/Favorites';
import TeamCollaboration from './components/TeamCollaboration';
import CampaignManager from './components/CampaignManager';
import TemplateLibrary from './components/TemplateLibrary';
import AIInsights from './components/AIInsights';
import AdvancedExport from './components/AdvancedExport';
import AdvancedSettings from './components/AdvancedSettings';
import { Hook, UserStats as UserStatsType, GenerationHistory } from './types';
import { generateHooks, generateHooksWithAI } from './utils/hookGenerator';
import { LocalStorageManager } from './utils/localStorage';
import { groqService } from './services/groqApi';

function App() {
  const [topic, setTopic] = useState('');
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Hook[]>([]);
  const [stats, setStats] = useState<UserStatsType>({
    totalGenerated: 0,
    totalCopied: 0,
    totalShared: 0,
    favoritesCount: 0,
    streak: 0,
    lastVisit: new Date()
  });
  
  // Modal states
  const [shareHook, setShareHook] = useState<Hook | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showTeamCollaboration, setShowTeamCollaboration] = useState(false);
  const [showCampaignManager, setShowCampaignManager] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<string>('');
  
  // Settings state
  const [generationSettings, setGenerationSettings] = useState({
    style: 'viral' as const,
    platform: 'general' as const,
    audience: 'general' as const,
    tone: 'friendly' as const,
    useGroqAPI: false,
    includeEmojis: true,
    includeHashtags: false,
    maxLength: 280
  });

  useEffect(() => {
    // Load data from localStorage
    setFavorites(LocalStorageManager.getFavorites());
    setStats(LocalStorageManager.getStats());
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing time for realistic experience
    await new Promise(resolve => setTimeout(resolve, generationSettings.useGroqAPI ? 3000 : 2000));
    
    const generatedHooks = await generateHooksWithAI(topic, generationSettings);
    setHooks(generatedHooks);
    setIsLoading(false);

    // Update stats
    LocalStorageManager.updateStats('generate');
    setStats(LocalStorageManager.getStats());

    // Add to history
    const historyEntry: GenerationHistory = {
      id: `gen-${Date.now()}`,
      topic,
      hooks: generatedHooks,
      timestamp: new Date()
    };
    LocalStorageManager.addToHistory(historyEntry);

    showNotification('🎉 5 fresh hooks generated!');
  };

  const handleRefresh = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, generationSettings.useGroqAPI ? 2500 : 1500));
    
    const newHooks = await generateHooksWithAI(topic, generationSettings);
    setHooks(newHooks);
    setIsLoading(false);

    LocalStorageManager.updateStats('generate');
    setStats(LocalStorageManager.getStats());

    showNotification('✨ Fresh hooks generated!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    LocalStorageManager.updateStats('copy');
    setStats(LocalStorageManager.getStats());
    showNotification('📋 Copied to clipboard!');
  };

  const toggleFavorite = (hook: Hook) => {
    const isFavorited = favorites.some(fav => fav.id === hook.id);
    let newFavorites;
    
    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav.id !== hook.id);
      showNotification('💔 Removed from favorites');
    } else {
      newFavorites = [...favorites, hook];
      showNotification('❤️ Added to favorites!');
    }
    
    setFavorites(newFavorites);
    LocalStorageManager.saveFavorites(newFavorites);
    LocalStorageManager.updateStats('favorite');
    setStats(LocalStorageManager.getStats());
  };

  const handleShare = (hook: Hook) => {
    setShareHook(hook);
    LocalStorageManager.updateStats('share');
    setStats(LocalStorageManager.getStats());
  };

  const handleUseTemplate = (template: any) => {
    // This would typically fill in the template with user input
    setTopic(template.name);
    setShowTemplateLibrary(false);
    showNotification('📝 Template loaded! Customize and generate.');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Header */}
      <Header
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowAdvancedSettings(true)}
        onFavoritesClick={() => setShowFavorites(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hook of the Day */}
        <HookOfTheDay />

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 bg-gray-50 rounded-xl">
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span>📚</span>
            <span>Templates</span>
          </button>
          
          <button
            onClick={() => setShowCampaignManager(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span>🎯</span>
            <span>Campaigns</span>
          </button>
          
          <button
            onClick={() => setShowTeamCollaboration(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span>👥</span>
            <span>Team</span>
          </button>
          
          <button
            onClick={() => setShowAIInsights(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span>🧠</span>
            <span>AI Insights</span>
          </button>
          
          <button
            onClick={() => setShowAdvancedExport(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span>📊</span>
            <span>Export</span>
          </button>
        </div>

        {/* Generator Section */}
        <div className="mb-12">
          <HookGenerator
            topic={topic}
            onTopicChange={setTopic}
            onGenerate={handleGenerate}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            hasHooks={hooks.length > 0}
          />
        </div>

        {/* Results Section */}
        {(hooks.length > 0 || isLoading) && (
          <div className="mb-12">
            <HookDisplay
              hooks={hooks}
              favorites={favorites}
              onCopy={copyToClipboard}
              onToggleFavorite={toggleFavorite}
              onShare={handleShare}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Features Section */}
        {hooks.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-black mb-6">
                Professional Hook Generation Made Simple
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered</h3>
                  <p className="text-gray-600 text-sm">Advanced AI generates unique, engaging hooks tailored to your topic.</p>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h3 className="font-semibold mb-2">Instant Results</h3>
                  <p className="text-gray-600 text-sm">Get 5 unique hooks in seconds, ready to boost your content engagement.</p>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <h3 className="font-semibold mb-2">Social Ready</h3>
                  <p className="text-gray-600 text-sm">Share directly to all major platforms or save your favorites.</p>
                </div>
              </div>
              
              <p className="text-gray-600">
                Enter any topic above to get started with professional hook generation.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-500">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-2">© 2025 Cloutline. Powered by AI for creators like you.</p>
          <p className="text-sm">Generate engaging hooks • Build your audience • Grow your brand</p>
        </div>
      </footer>

      {/* Modals */}
      <SocialShare
        hook={shareHook}
        isOpen={!!shareHook}
        onClose={() => setShareHook(null)}
      />
      
      <UserStats
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
      
      <Favorites
        favorites={favorites}
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onCopy={copyToClipboard}
        onShare={handleShare}
        onRemoveFavorite={toggleFavorite}
      />
      
      <AdvancedSettings
        isOpen={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
        settings={generationSettings}
        onSettingsChange={setGenerationSettings}
      />
      
      <TeamCollaboration
        isOpen={showTeamCollaboration}
        onClose={() => setShowTeamCollaboration(false)}
      />
      
      <CampaignManager
        isOpen={showCampaignManager}
        onClose={() => setShowCampaignManager(false)}
      />
      
      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onUseTemplate={handleUseTemplate}
      />
      
      <AIInsights
        isOpen={showAIInsights}
        onClose={() => setShowAIInsights(false)}
        hooks={hooks}
        userStats={stats}
      />
      
      <AdvancedExport
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
        hooks={hooks}
        favorites={favorites}
      />
    </div>
  );
}

export default App;
