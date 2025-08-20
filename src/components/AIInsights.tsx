import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, X } from 'lucide-react';
import { AIInsight } from '../types';

interface AIInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  hooks: any[];
  userStats: any;
}

const AIInsights: React.FC<AIInsightsProps> = ({ isOpen, onClose, hooks, userStats }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    if (isOpen) {
      generateInsights();
    }
  }, [isOpen, hooks, userStats]);

  const generateInsights = () => {
    const newInsights: AIInsight[] = [];

    // Performance insights
    if (hooks.length > 0) {
      const avgEngagement = hooks.reduce((sum, hook) => sum + hook.engagement, 0) / hooks.length;
      if (avgEngagement > 80) {
        newInsights.push({
          id: '1',
          type: 'suggestion',
          title: 'High Performance Detected',
          description: `Your hooks are performing exceptionally well with ${avgEngagement.toFixed(1)}% average engagement. Consider creating similar content.`,
          actionable: true,
          priority: 'high',
          createdAt: new Date()
        });
      }
    }

    // Usage patterns
    if (userStats.streak > 7) {
      newInsights.push({
        id: '2',
        type: 'trend',
        title: 'Consistency Streak',
        description: `You've been consistently active for ${userStats.streak} days. This consistency is key to building audience engagement.`,
        actionable: false,
        priority: 'medium',
        createdAt: new Date()
      });
    }

    // Optimization suggestions
    if (userStats.totalCopied < userStats.totalGenerated * 0.3) {
      newInsights.push({
        id: '3',
        type: 'optimization',
        title: 'Low Copy Rate',
        description: 'You\'re copying fewer hooks than average. Try experimenting with different styles to find what resonates with you.',
        actionable: true,
        priority: 'medium',
        createdAt: new Date()
      });
    }

    // Trending topics
    newInsights.push({
      id: '4',
      type: 'trend',
      title: 'Trending Topics',
      description: 'AI, productivity, and personal branding are trending this week. Consider creating hooks around these topics.',
      actionable: true,
      priority: 'low',
      createdAt: new Date()
    });

    // Warning about overuse
    if (userStats.totalGenerated > 100) {
      newInsights.push({
        id: '5',
        type: 'warning',
        title: 'High Usage Detected',
        description: 'You\'ve generated a lot of hooks recently. Remember to focus on quality over quantity for better engagement.',
        actionable: true,
        priority: 'medium',
        createdAt: new Date()
      });
    }

    setInsights(newInsights);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'optimization': return <Target className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Brain className="w-5 h-5 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">AI Insights</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Personalized recommendations based on your usage patterns</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">Generating insights...</h4>
              <p className="text-gray-500">Keep using the app to get personalized recommendations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`border-l-4 rounded-lg p-4 ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {insight.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{insight.description}</p>
                      {insight.actionable && (
                        <button className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-lg hover:border-black transition-colors">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Insights update automatically based on your activity</span>
            <button
              onClick={generateInsights}
              className="text-black hover:underline"
            >
              Refresh Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
