import React, { useState } from 'react';
import { Users, Plus, Crown, Shield, Edit, Eye, Trash2, Share2 } from 'lucide-react';
import { TeamMember, Hook } from '../types';

interface TeamCollaborationProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'shared' | 'settings'>('members');
  const [members] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'owner',
      joinedAt: new Date(),
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@company.com',
      role: 'admin',
      joinedAt: new Date(),
      lastActive: new Date()
    }
  ]);

  const [sharedHooks] = useState<Hook[]>([
    {
      id: '1',
      text: 'The marketing strategy that 10x our revenue',
      topic: 'Marketing',
      category: 'Business',
      createdAt: new Date(),
      engagement: 95
    }
  ]);

  if (!isOpen) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'editor': return <Edit className="w-4 h-4 text-green-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Team Collaboration</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          <div className="flex space-x-1 mt-4">
            {[
              { id: 'members', label: 'Team Members' },
              { id: 'shared', label: 'Shared Hooks' },
              { id: 'settings', label: 'Team Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Team Members ({members.length})</h4>
                <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>

              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className="text-sm capitalize">{member.role}</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shared' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Shared Hooks ({sharedHooks.length})</h4>
                <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share Hook</span>
                </button>
              </div>

              {sharedHooks.map((hook) => (
                <div key={hook.id} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium mb-2">{hook.text}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Topic: {hook.topic}</span>
                    <span>{hook.engagement}% engagement</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Team Settings</h4>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Allow members to share hooks</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span>Require approval for shared hooks</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Enable team analytics</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCollaboration;