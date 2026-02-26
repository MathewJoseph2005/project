import { useEffect, useState } from 'react';
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
    // Simulate loading delay for demonstration
    setTimeout(() => {
      const userStats = perfMonitor.getUserStats();
      setStats(userStats);
      setLoading(false);
    }, 800);
  }, []);

  const getPerformanceRating = (winRate) => {
    if (winRate >= 80) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-100' };
    if (winRate >= 60) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (winRate >= 40) return { label: 'Average', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { label: 'Needs Practice', color: 'text-red-500', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl text-slate-300">Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <nav className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Link
            to="/game"
            className="flex items-center gap-2 text-blue-400 hover:text-cyan-300 transition font-semibold"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Performance Stats</h1>
          <button
            onClick={logout}
            className="btn-danger text-xs sm:text-sm font-medium px-3 py-2"
          >
            Exit
          </button>
        </div>
      </nav>

      <div className="flex-1 container mx-auto p-4 sm:p-8">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-10 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
            Welcome back, {user?.username}! 👾
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">Your Pac-Man gaming journey</p>
        </div>

        {/* Overall Rating */}
        <div className={`card p-6 sm:p-8 mb-8 border-l-4 ${rating.color === 'text-green-500' ? 'border-green-500 bg-gradient-to-br from-green-900/20 to-emerald-900/20' : rating.color === 'text-blue-500' ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-cyan-900/20' : rating.color === 'text-yellow-500' ? 'border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-orange-900/20' : 'border-red-500 bg-gradient-to-br from-red-900/20 to-pink-900/20'} backdrop-blur-xl shadow-xl`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Overall Performance</p>
              <p className={`text-4xl sm:text-5xl font-bold mt-3 ${rating.color}`}>{rating.label}</p>
              <p className="text-slate-300 text-sm mt-2">Win Rate: <span className="font-bold text-lg">{stats.winRate.toFixed(1)}%</span></p>
            </div>
            <Trophy size={64} className={`${rating.color} opacity-80`} />
          </div>
        </div>

        {stats.totalGames === 0 ? (
          <div className="card p-12 sm:p-16 text-center border-slate-700/50 backdrop-blur-xl">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-slate-300 text-lg mb-4">No games played yet!</p>
              <p className="text-slate-400 text-sm mb-6">Start playing to track your performance and climb the leaderboard.</p>
            </div>
            <Link
              to="/game"
              className="btn-success px-6 sm:px-8 py-3 inline-block"
            >
              🚀 Play Your First Game
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {/* Total Games */}
              <div className="card p-4 sm:p-6 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between mb-3 sm:mb-4">
                  <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase">Games</p>
                  <Zap size={20} className="text-yellow-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white">{stats.totalGames}</p>
              </div>

              {/* Best Score */}
              <div className="card p-4 sm:p-6 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-yellow-900/20 to-orange-900/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between mb-3 sm:mb-4">
                  <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase">Best</p>
                  <Trophy size={20} className="text-yellow-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-yellow-300">{stats.bestScore}</p>
              </div>

              {/* Average Score */}
              <div className="card p-4 sm:p-6 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between mb-3 sm:mb-4">
                  <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase">Average</p>
                  <TrendingUp size={20} className="text-green-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-green-300">{stats.averageScore}</p>
              </div>

              {/* Win Rate */}
              <div className="card p-4 sm:p-6 border-slate-700/50 backdrop-blur-xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-between mb-3 sm:mb-4">
                  <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase">Win Rate</p>
                  <Zap size={20} className="text-purple-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-purple-300">{stats.winRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <Timer size={24} className="text-purple-500" />
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Total Playtime</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.totalPlaytime}</p>
                    <p className="text-gray-500 text-xs mt-1">minutes</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <Trophy size={24} className="text-orange-500" />
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Avg per Game</p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {Math.round(stats.totalPlaytime / (stats.totalGames || 1))}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Games */}
            {stats.recentGames && stats.recentGames.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Recent Games</h3>
                <div className={isMobile ? 'space-y-2' : 'overflow-x-auto'}>
                  {isMobile ? (
                    <div className="space-y-2">
                      {stats.recentGames.map((game, idx) => (
                        <div key={idx} className="bg-gray-700 rounded p-3 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-sm">{game.score} pts</p>
                            <p className="text-xs text-gray-400">
                              {Math.round(game.duration / 60)} min {game.won ? '✓ Won' : '✗ Lost'}
                            </p>
                          </div>
                          <span className={`text-xs font-bold ${game.won ? 'text-green-500' : 'text-red-500'}`}>
                            {game.won ? 'WIN' : 'LOSS'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 px-3">Score</th>
                          <th className="text-left py-2 px-3">Duration</th>
                          <th className="text-left py-2 px-3">Result</th>
                          <th className="text-left py-2 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentGames.map((game, idx) => (
                          <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-2 px-3 font-semibold">{game.score}</td>
                            <td className="py-2 px-3">{Math.round(game.duration / 60)} min</td>
                            <td className="py-2 px-3">
                              <span className={game.won ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                                {game.won ? 'WON' : 'LOST'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-400">
                              {new Date(game.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center mt-8">
              <Link
                to="/game"
                className="bg-green-600 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-bold hover:bg-green-700 inline-block"
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
