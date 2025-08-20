import { Hook, UserStats, GenerationHistory } from '../types';

export class LocalStorageManager {
  private static KEYS = {
    FAVORITES: 'cloutline-favorites',
    STATS: 'cloutline-stats',
    HISTORY: 'cloutline-history',
    SETTINGS: 'cloutline-settings'
  };

  static getFavorites(): Hook[] {
    const data = localStorage.getItem(this.KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  }

  static saveFavorites(favorites: Hook[]): void {
    localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
  }

  static getStats(): UserStats {
    const data = localStorage.getItem(this.KEYS.STATS);
    return data ? JSON.parse(data) : {
      totalGenerated: 0,
      totalCopied: 0,
      totalShared: 0,
      favoritesCount: 0,
      streak: 0,
      lastVisit: new Date()
    };
  }

  static saveStats(stats: UserStats): void {
    localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
  }

  static getHistory(): GenerationHistory[] {
    const data = localStorage.getItem(this.KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }

  static saveHistory(history: GenerationHistory[]): void {
    // Keep only last 50 generations
    const limitedHistory = history.slice(-50);
    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(limitedHistory));
  }

  static addToHistory(entry: GenerationHistory): void {
    const history = this.getHistory();
    history.push(entry);
    this.saveHistory(history);
  }

  static updateStats(action: 'generate' | 'copy' | 'share' | 'favorite'): void {
    const stats = this.getStats();
    
    switch (action) {
      case 'generate':
        stats.totalGenerated += 1;
        break;
      case 'copy':
        stats.totalCopied += 1;
        break;
      case 'share':
        stats.totalShared += 1;
        break;
      case 'favorite':
        stats.favoritesCount = this.getFavorites().length;
        break;
    }
    
    // Update streak
    const today = new Date();
    const lastVisit = new Date(stats.lastVisit);
    const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      stats.streak += 1;
    } else if (diffDays > 1) {
      stats.streak = 1;
    }
    
    stats.lastVisit = today;
    this.saveStats(stats);
  }
}
