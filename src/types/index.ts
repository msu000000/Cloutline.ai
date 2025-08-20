export interface Hook {
  id: string;
  text: string;
  topic: string;
  category: string;
  createdAt: Date;
  engagement: number;
  platform?: string;
  style?: string;
  audience?: string;
  performance?: HookPerformance;
  tags?: string[];
  isAIGenerated?: boolean;
}

export interface HookPerformance {
  views?: number;
  clicks?: number;
  shares?: number;
  saves?: number;
  ctr?: number;
  engagementRate?: number;
  lastUpdated: Date;
}

export interface UserStats {
  totalGenerated: number;
  totalCopied: number;
  totalShared: number;
  favoritesCount: number;
  streak: number;
  lastVisit: Date;
  weeklyActivity: number[];
  topTopics: { topic: string; count: number }[];
  averageEngagement: number;
  totalSessions: number;
  premiumFeatures?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  templates: string[];
  color: string;
}

export interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  url: (text: string) => string;
  characterLimit?: number;
}

export interface GenerationHistory {
  id: string;
  topic: string;
  hooks: Hook[];
  timestamp: Date;
  settings: GenerationSettings;
  performance?: {
    totalViews: number;
    totalEngagement: number;
    bestPerforming: string;
  };
}

export interface GenerationSettings {
  style: 'viral' | 'professional' | 'casual' | 'controversial' | 'educational';
  platform: 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'youtube' | 'general';
  audience: 'general' | 'business' | 'creators' | 'students' | 'entrepreneurs';
  tone: 'friendly' | 'authoritative' | 'humorous' | 'inspiring' | 'urgent';
  useGroqAPI: boolean;
  includeEmojis: boolean;
  includeHashtags: boolean;
  maxLength: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  sharedHooks: Hook[];
  settings: TeamSettings;
  createdAt: Date;
}

export interface TeamSettings {
  allowSharing: boolean;
  requireApproval: boolean;
  defaultSettings: GenerationSettings;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  examples: string[];
  popularity: number;
  isPremium?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  hooks: Hook[];
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'paused';
  performance: CampaignPerformance;
}

export interface CampaignPerformance {
  totalReach: number;
  totalEngagement: number;
  clickThroughRate: number;
  conversionRate: number;
  topPerformingHook: string;
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'trend' | 'optimization' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'txt' | 'docx';
  includeMetadata: boolean;
  includePerformance: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
