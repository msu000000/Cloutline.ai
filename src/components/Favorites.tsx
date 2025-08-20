import React from 'react';
import { X, Heart, Copy, Share2, Trash2 } from 'lucide-react';
import { Hook } from '../types';

interface FavoritesProps {
  favorites: Hook[];
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
  onShare: (hook: Hook) => void;
  onRemoveFavorite: (hook: Hook) => void;
}

const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  isOpen,
  onClose,
  onCopy,
  onShare,
  onRemoveFavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <h3 className="text-xl font-bold">Your Favorites ({favorites.length})</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-96 p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No favorites yet</h4>
              <p className="text-gray-500">Start generating hooks and save your favorites!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((hook, index) => (
                <div
                  key={hook.id}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                        <span className="px-2 py-1 text-xs bg-white rounded-md">{hook.category}</span>
                      </div>
                      <p className="font-medium text-gray-800 leading-relaxed">{hook.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        From: {hook.topic} • {new Date(hook.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onCopy(hook.text)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all duration-200"
                        title="Copy hook"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onShare(hook)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all duration-200"
                        title="Share hook"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onRemoveFavorite(hook)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all duration-200"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                const allText = favorites.map((hook, i) => `${i + 1}. ${hook.text}`).join('\n\n');
                const blob = new Blob([allText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cloutline-favorites-${Date.now()}.txt`;
                a.click();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <span>📄</span>
              <span>Export All Favorites</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
