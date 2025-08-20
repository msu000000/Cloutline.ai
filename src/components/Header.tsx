import React from 'react';
import { Zap, Settings, BarChart3, Heart } from 'lucide-react';

interface HeaderProps {
  onStatsClick: () => void;
  onSettingsClick: () => void;
  onFavoritesClick: () => void;
  favoritesCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onStatsClick, 
  onSettingsClick, 
  onFavoritesClick,
  favoritesCount 
}) => {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Cloutline</h1>
              <p className="text-xs text-gray-500 font-medium">AI Hook Generator</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onFavoritesClick}
              className="relative p-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
            
            <button
              onClick={onStatsClick}
              className="p-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
              title="Statistics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={onSettingsClick}
              className="p-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
