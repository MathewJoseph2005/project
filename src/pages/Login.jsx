import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from '../components/Router';
import { Gamepad2, Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    // Prevent zoom on input focus on mobile
    document.addEventListener('touchstart', (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    });
  }, []);

  if (user) {
    return <Navigate to={user.isAdmin ? '/admin' : '/game'} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent mb-2">
            Pac-Man Arena
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Master the maze and dominate the leaderboard</p>
        </div>

        {/* Main card */}
        <div className="card p-8 sm:p-10 border border-slate-700/50 backdrop-blur-xl animate-slide-up" style={{animationDelay: '0.2s'}}>
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base flex items-start gap-3 animate-slide-in">
              <div className="w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">!</span>
              </div>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="input-modern w-full pl-12 pr-4"
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="input-modern w-full pl-12 pr-4"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {loading ? 'Authenticating...' : 'Enter Arena'}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-800 text-slate-400">New player?</span>
            </div>
          </div>

          {/* Register link */}
          <Link to="/register" className="btn-secondary w-full text-center block">
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs sm:text-sm mt-6">
          Challenge yourself in the ultimate Pac-Man experience
        </p>
      </div>
    </div>
  );
};
