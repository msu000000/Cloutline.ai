import React, { useState } from 'react';
import { BookOpen, Search, Filter, Star, Crown, Copy } from 'lucide-react';
import { Template } from '../types';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ isOpen, onClose, onUseTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Question Hook',
      description: 'Engage with thought-provoking questions',
      category: 'Engagement',
      template: 'What if I told you {topic} could {benefit}?',
      variables: ['topic', 'benefit'],
      examples: ['What if I told you meditation could double your productivity?'],
      popularity: 95,
      isPremium: false
    },
    {
      id: '2',
      name: 'Shocking Statistic',
      description: 'Use surprising numbers to grab attention',
      category: 'Authority',
      template: '{percentage}% of people don\'t know this {topic} secret',
      variables: ['percentage', 'topic'],
      examples: ['97% of people don\'t know this productivity secret'],
      popularity: 88,
      isPremium: false
    },
    {
      id: '3',
      name: 'Personal Story',
      description: 'Share compelling personal experiences',
      category: 'Story',
      template: 'How {topic} changed my life in {timeframe}',
      variables: ['topic', 'timeframe'],
      examples: ['How meditation changed my life in 30 days'],
      popularity: 92,
      isPremium: true
    },
    {
      id: '4',
      name: 'Controversial Take',
      description: 'Challenge common beliefs',
      category: 'Controversial',
      template: 'Unpopular opinion: {topic} is {controversial_statement}',
      variables: ['topic', 'controversial_statement'],
      examples: ['Unpopular opinion: Social media is killing creativity'],
      popularity: 85,
      isPremium: true
    },
    {
      id: '5',
      name: 'List Promise',
      description: 'Promise valuable lists',
      category: 'Educational',
      template: '{number} {topic} {items} that will {benefit}',
      variables: ['number', 'topic', 'items', 'benefit'],
      examples: ['5 productivity hacks that will save you 2 hours daily'],
      popularity: 90,
      isPremium: false
    }
  ];

  const categories = ['all', 'Engagement', 'Authority', 'Story', 'Controversial', 'Educational'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold">Template Library</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-xl p-6 hover:border-black transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{template.name}</h4>
                      {template.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500">{template.popularity}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{template.category}</span>
                      <span className="text-xs text-gray-500">{template.variables.length} variables</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onUseTemplate(template)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Use</span>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-mono text-gray-800">{template.template}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                  <p className="text-sm text-gray-700 italic">{template.examples[0]}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No templates found</h4>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;