import React from 'react';
import { X, TrendingUp, Copy, Share2, Heart, Zap, Calendar } from 'lucide-react';
import { UserStats as UserStatsType } from '../types';

interface UserStatsProps {
  stats: UserStatsType;
  isOpen: boolean;
  onClose: () => void;
}

const UserStats: React.FC<UserStatsProps> = ({ stats, isOpen, onClose }) => {
  if (!isOpen) return null;

  const statItems = [
    { label: 'Hooks Generated', value: stats.totalGenerated, icon: Zap, color: 'text-blue-600' },
    { label: 'Hooks Copied', value: stats.totalCopied, icon: Copy, color: 'text-green-600' },
    { label: 'Hooks Shared', value: stats.totalShared, icon: Share2, color: 'text-purple-600' },
    { label: 'Favorites', value: stats.favoritesCount, icon: Heart, color: 'text-red-600' },
    { label: 'Current Streak', value: `${stats.streak} days`, icon: Calendar, color: 'text-orange-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Your Stats</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {statItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="font-bold text-lg text-black">{item.value}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Member since</p>
            <p className="font-semibold text-black">
              {new Date(stats.lastVisit).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Keep generating hooks to improve your stats! 🚀
        </p>
      </div>
    </div>
  );
};

export default UserStats;