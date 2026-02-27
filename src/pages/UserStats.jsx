import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../components/Router';
import { perfMonitor } from '../utils/performanceMonitor';
import { TrendingUp, Zap, Timer, Trophy, ArrowLeft } from 'lucide-react';

export const UserStats = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const userStats = perfMonitor.getUserStats();
    setStats(userStats);
    setLoading(false);
  }, []);

  const getPerformanceRating = (winRate) => {
    if (winRate >= 80) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-100' };
    if (winRate >= 60) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (winRate >= 40) return { label: 'Average', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { label: 'Needs Practice', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const rating = !loading && stats ? getPerformanceRating(stats.winRate) : { label: 'Loading', color: 'text-slate-400' };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-300">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <nav className="bg-slate-800 border-b border-slate-700 p-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/game"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg font-bold text-blue-300">Performance Stats</h1>
          <button
            onClick={logout}
            className="text-xs font-medium px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Exit
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.username}! 👾</h2>
          <p className="text-slate-400 text-sm">Your Pac-Man gaming journey</p>
        </div>

        {/* Overall Rating */}
        <div className={`p-6 mb-6 border-l-4 rounded ${rating.color === 'text-green-500' ? 'border-green-500 bg-green-900/10' : rating.color === 'text-blue-500' ? 'border-blue-500 bg-blue-900/10' : rating.color === 'text-yellow-500' ? 'border-yellow-500 bg-yellow-900/10' : 'border-red-500 bg-red-900/10'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase">Overall Performance</p>
              <p className={`text-4xl font-bold mt-2 ${rating.color}`}>{rating.label}</p>
              <p className="text-slate-300 text-sm mt-2">Win Rate: <span className="font-bold">{stats.winRate.toFixed(1)}%</span></p>
            </div>
            <Trophy size={48} className={`${rating.color}`} />
          </div>
        </div>

        {stats.totalGames === 0 ? (
          <div className="p-8 text-center border border-slate-700 rounded">
            <div className="mb-4">
              <div className="text-5xl mb-3">🎮</div>
              <p className="text-slate-300 text-lg mb-3">No games played yet!</p>
              <p className="text-slate-400 text-sm mb-4">Start playing to track your performance.</p>
            </div>
            <Link
              to="/game"
              className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 inline-block text-sm"
            >
              🚀 Play Your First Game
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {/* Total Games */}
              <div className="p-4 border border-slate-700 rounded bg-blue-900/10">
                <p className="text-slate-400 text-xs font-semibold mb-2">Games</p>
                <p className="text-3xl font-bold">{stats.totalGames}</p>
              </div>

              {/* Best Score */}
              <div className="p-4 border border-slate-700 rounded bg-yellow-900/10">
                <p className="text-slate-400 text-xs font-semibold mb-2">Best Score</p>
                <p className="text-3xl font-bold text-yellow-300">{stats.bestScore}</p>
              </div>

              {/* Average Score */}
              <div className="p-4 border border-slate-700 rounded bg-green-900/10">
                <p className="text-slate-400 text-xs font-semibold mb-2">Average</p>
                <p className="text-3xl font-bold text-green-300">{stats.averageScore}</p>
              </div>

              {/* Playtime */}
              <div className="p-4 border border-slate-700 rounded bg-purple-900/10">
                <p className="text-slate-400 text-xs font-semibold mb-2">Playtime</p>
                <p className="text-3xl font-bold text-purple-300">{stats.totalPlaytime}m</p>
              </div>
            </div>

            {/* Recent Games */}
            {stats.recentGames && stats.recentGames.length > 0 && (
              <div className="border border-slate-700 rounded p-4 mb-6">
                <h3 className="text-lg font-bold mb-4">Recent Games</h3>
                <div className="space-y-2">
                  {stats.recentGames.map((game, idx) => (
                    <div key={idx} className="bg-slate-800 rounded p-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold">{game.score} pts</p>
                        <p className="text-xs text-slate-400">{Math.round(game.duration / 60)}m ago</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${game.won ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {game.won ? '✓ WIN' : '✗ LOSS'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* CTA */}
            <div className="text-center">
              <Link
                to="/game"
                className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 inline-block text-sm"
              >
                Play Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
