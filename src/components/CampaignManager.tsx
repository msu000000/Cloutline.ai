import React, { useState } from 'react';
import { Calendar, Target, TrendingUp, Play, Pause, Plus, BarChart3 } from 'lucide-react';
import { Campaign, Hook } from '../types';

interface CampaignManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ isOpen, onClose }) => {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q1 Product Launch',
      description: 'Hooks for new product announcement',
      hooks: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      performance: {
        totalReach: 15420,
        totalEngagement: 2340,
        clickThroughRate: 3.2,
        conversionRate: 1.8,
        topPerformingHook: 'Revolutionary product that changes everything'
      }
    },
    {
      id: '2',
      name: 'Content Marketing',
      description: 'Educational content hooks',
      hooks: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'draft',
      performance: {
        totalReach: 0,
        totalEngagement: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        topPerformingHook: ''
      }
    }
  ]);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">Campaign Manager</h3>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold">{campaign.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="capitalize">{campaign.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Start: {campaign.startDate.toLocaleDateString()}</span>
                      <span>End: {campaign.endDate.toLocaleDateString()}</span>
                      <span>{campaign.hooks.length} hooks</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-black rounded-lg">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {campaign.status === 'active' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">{campaign.performance.totalReach.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Total Reach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">{campaign.performance.totalEngagement.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">{campaign.performance.clickThroughRate}%</p>
                      <p className="text-xs text-gray-500">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black">{campaign.performance.conversionRate}%</p>
                      <p className="text-xs text-gray-500">Conversion</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-black transition-colors">
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {campaign.performance.topPerformingHook && (
                      <span>Top: "{campaign.performance.topPerformingHook.substring(0, 30)}..."</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;
