import React, { useState } from 'react';
import { Link, useNavigate } from '../components/Router';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Trophy, Zap, Settings } from 'lucide-react';

export const Landing = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const errors = [
    'MongoTimeoutError: Massive skill issue',
    'AuthenticationFailed: Database does not vibe',
    'EADDRINUSE: port 3000',
    'Memory Leak: Too much drip',
  ];

  const handlePlayClick = () => {
    navigate(user ? '/game' : '/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-slate-950 border-b border-yellow-400/20 py-2">
        <div className="text-yellow-400 font-mono text-xs uppercase text-center">
          ► {errors[0]} ◄
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Icon */}
        <Gamepad2 size={64} className="text-yellow-400 mb-4" />

        {/* Title */}
        <h1 className="text-5xl font-bold text-yellow-400 mb-6 text-center">
          VIBE-CODED<br />PAC-MAN
        </h1>

        {/* Error Box */}
        <div className="mb-8 max-w-md">
          <div className="bg-black/60 border border-red-500/50 p-3 rounded text-sm text-center">
            <p className="text-red-500 font-mono">⚠️ {errors[0]}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <button
            onClick={handlePlayClick}
            className="w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300"
          >
            🎮 PLAY
          </button>

          <Link
            to="/stats"
            className="w-full py-3 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700 inline-block text-center"
          >
            📊 STATS
          </Link>

          {user && (
            <button
              onClick={logout}
              className="w-full py-2 bg-red-600 text-white font-bold rounded text-sm hover:bg-red-700"
            >
              LOGOUT
            </button>
          )}
        </div>

        {/* Ghosts */}
        <div className="flex gap-6 justify-center">
          <div className="text-center">
            <div className="text-4xl mb-1">👻</div>
            <p className="text-xs text-red-400">BLINKY</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">👻</div>
            <p className="text-xs text-pink-400">PINKY</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">👻</div>
            <p className="text-xs text-cyan-400">INKY</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">👻</div>
            <p className="text-xs text-orange-400">SUE</p>
          </div>
        </div>
      </main>

      {/* Footer Nav */}
      <nav className="bg-slate-950 border-t border-slate-700 py-4 px-4">
        <div className="flex justify-around max-w-4xl mx-auto">
          <Link
            to="/game"
            className="flex flex-col items-center gap-1 text-yellow-400 hover:text-yellow-300"
          >
            <Gamepad2 size={20} />
            <span className="text-xs">Play</span>
          </Link>

          <Link
            to="/stats"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-pink-400"
          >
            <Trophy size={20} />
            <span className="text-xs">Rank</span>
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin"
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400"
            >
              <Zap size={20} />
              <span className="text-xs">Admin</span>
            </Link>
          )}

          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-default">
            <Settings size={20} />
            <span className="text-xs">Config</span>
          </div>
        </div>
      </nav>

      {user && (
        <div className="bg-slate-900/50 border-t border-slate-700 px-4 py-2 text-center text-xs">
          <p className="text-slate-300">Logged in as <span className="font-bold">{user.username}</span></p>
        </div>
      )}
    </div>
  );
};
