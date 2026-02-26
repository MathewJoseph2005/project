// Performance Monitoring Utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      apiResponseTimes: {},
      interactions: [],
      gameStats: []
    };
    this.startTime = performance.now();
  }

  // Track API response times
  trackApiCall(endpoint, duration) {
    if (!this.metrics.apiResponseTimes[endpoint]) {
      this.metrics.apiResponseTimes[endpoint] = [];
    }
    this.metrics.apiResponseTimes[endpoint].push(duration);
  }

  // Get average API response time
  getAverageApiTime(endpoint) {
    const times = this.metrics.apiResponseTimes[endpoint] || [];
    if (times.length === 0) return 0;
    return Math.round(times.reduce((a, b) => a + b) / times.length);
  }

  // Track game statistics
  recordGameSession(score, duration, won) {
    this.metrics.gameStats.push({
      score,
      duration,
      won,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('gameStats', JSON.stringify(this.metrics.gameStats));
  }

  // Get user performance stats
  getUserStats() {
    const stats = this.metrics.gameStats;
    if (stats.length === 0) {
      return {
        totalGames: 0,
        averageScore: 0,
        bestScore: 0,
        totalPlaytime: 0,
        winRate: 0
      };
    }

    const totalGames = stats.length;
    const averageScore = Math.round(stats.reduce((sum, s) => sum + s.score, 0) / totalGames);
    const bestScore = Math.max(...stats.map(s => s.score));
    const totalPlaytime = Math.round(stats.reduce((sum, s) => sum + s.duration, 0) / 60); // in minutes
    const wins = stats.filter(s => s.won).length;
    const winRate = Math.round((wins / totalGames) * 100);

    return {
      totalGames,
      averageScore,
      bestScore,
      totalPlaytime,
      winRate,
      recentGames: stats.slice(-5).reverse()
    };
  }

  // Get Web Vitals estimates
  getWebVitals() {
    return {
      FCP: Math.round(performance.now()),
      LCP: Math.round(performance.now()),
      CLS: 0,
      FID: 0
    };
  }

  // Get memory usage (if available)
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {
      pageLoadTime: 0,
      apiResponseTimes: {},
      interactions: [],
      gameStats: []
    };
  }

  // Load stats from localStorage
  loadStats() {
    try {
      const saved = localStorage.getItem('gameStats');
      if (saved) {
        this.metrics.gameStats = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }
}

export const perfMonitor = new PerformanceMonitor();
perfMonitor.loadStats();
