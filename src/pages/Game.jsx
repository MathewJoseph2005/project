import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../components/Router';
import { perfMonitor } from '../utils/performanceMonitor';
import { Joystick, DPad, Touchpad } from '../components/GameControls';
import { BarChart3, Gamepad2 } from 'lucide-react';

export const Game = () => {
  const canvasRef = useRef(null);
  const { user, logout } = useAuth();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400);
  const [gameTime, setGameTime] = useState(0);
  const [controlType, setControlType] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    const width = window.innerWidth < 768;
    const touchCapable = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    return width && touchCapable();
  });
  const touchStartPos = useRef({ x: 0, y: 0 });
  const gameStateRef = useRef({});
  const gameStartTimeRef = useRef(null);
  const pacmanDirectionRef = useRef('right');

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const handleJoystickDirection = (direction) => {
    if (direction === 'idle') return;
    pacmanDirectionRef.current = direction;
    if (gameStateRef.current.pacman) {
      gameStateRef.current.pacman.direction = direction;
    }
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobileScreen = window.innerWidth < 768;
      const touchCapable = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
      const isDeviceMobile = isMobileScreen && touchCapable();
      
      setIsMobile(isDeviceMobile);
      
      if (isMobileScreen) {
        setCanvasSize(Math.min(window.innerWidth - 32, 300));
      } else if (window.innerWidth < 1024) {
        setCanvasSize(350);
      } else {
        setCanvasSize(400);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    let pacman = { x: 1, y: 1, direction: 'right' };
    let dots = [];
    let walls = [];
    let ghosts = [
      { x: 18, y: 1, color: '#FF0000' },
      { x: 1, y: 18, color: '#FFB8FF' },
      { x: 18, y: 18, color: '#00FFFF' }
    ];

    gameStateRef.current = { pacman, dots, walls, ghosts };

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (i === 0 || i === 19 || j === 0 || j === 19) {
          walls.push({ x: i, y: j });
        } else if (Math.random() > 0.85) {
          walls.push({ x: i, y: j });
        } else {
          dots.push({ x: i, y: j });
        }
      }
    }

    pacman.direction = pacmanDirectionRef.current;

    let gameActive = true;

    const movePacman = () => {
      const { x, y, direction } = pacman;
      let newX = x,
          newY = y;

      if (direction === 'up') newY = Math.max(0, y - 1);
      if (direction === 'down') newY = Math.min(19, y + 1);
      if (direction === 'left') newX = Math.max(0, x - 1);
      if (direction === 'right') newX = Math.min(19, x + 1);

      const isWall = walls.some(w => w.x === newX && w.y === newY);
      if (!isWall) {
        pacman.x = newX;
        pacman.y = newY;
      }

      const dotIndex = dots.findIndex(d => d.x === pacman.x && d.y === pacman.y);
      if (dotIndex !== -1) {
        setScore(prev => prev + 10);
        dots.splice(dotIndex, 1);
      }

      const caughtByGhost = ghosts.some(g => g.x === pacman.x && g.y === pacman.y);
      if (caughtByGhost) {
        gameActive = false;
        setGameOver(true);
      }

      if (dots.length === 0) {
        gameActive = false;
        setGameOver(true);
      }
    };

    const moveGhosts = () => {
      ghosts.forEach(ghost => {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        let newX = ghost.x,
            newY = ghost.y;

        if (randomDirection === 'up') newY = Math.max(0, ghost.y - 1);
        if (randomDirection === 'down') newY = Math.min(19, ghost.y + 1);
        if (randomDirection === 'left') newX = Math.max(0, ghost.x - 1);
        if (randomDirection === 'right') newX = Math.min(19, ghost.x + 1);

        const isWall = walls.some(w => w.x === newX && w.y === newY);
        if (!isWall) {
          ghost.x = newX;
          ghost.y = newY;
        }
      });
    };

    const draw = () => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      walls.forEach(wall => {
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(wall.x * gridSize, wall.y * gridSize, gridSize, gridSize);
      });

      dots.forEach(dot => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(dot.x * gridSize + gridSize / 2, dot.y * gridSize + gridSize / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2, 8, 0, Math.PI * 2);
      ctx.fill();

      ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.fillRect(ghost.x * gridSize, ghost.y * gridSize, gridSize, gridSize);
      });

      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvasSize, canvasSize);
    };

    const gameLoop = setInterval(() => {
      if (!gameActive) {
        clearInterval(gameLoop);
        return;
      }

      movePacman();
      moveGhosts();
      draw();
    }, 100);

    draw();

    const handleKeyPress = (e) => {
      const directionMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
      const direction = directionMap[e.key];
      if (direction) {
        pacmanDirectionRef.current = direction;
        pacman.direction = direction;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, canvasSize]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
    setGameTime(0);
    gameStartTimeRef.current = Date.now();
  };

  const restartGame = () => {
    setGameStarted(false);
    setTimeout(() => startGame(), 100);
  };

  useEffect(() => {
    if (gameOver && gameStarted) {
      const duration = gameTime;
      const won = score > 0;
      perfMonitor.recordGameSession(score, duration, won);
    }
  }, [gameOver]);

  const isJoystickActive = isMobile && gameStarted && (controlType === null || controlType === 'joystick');
  const isDPadActive = isMobile && gameStarted && controlType === 'dpad';
  const isTouchpadActive = isMobile && gameStarted && controlType === 'touchpad';
  const isSwipeActive = isMobile && gameStarted && controlType === 'swipe';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <nav className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-3 sm:p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-1.5 rounded-lg">
              <Gamepad2 size={20} className="text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Pac-Man Arena</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-slate-300 px-3 py-1 bg-slate-700/30 rounded-full flex-shrink-0">
              {user?.username}
            </span>
            <Link to="/stats" className="btn-secondary text-xs sm:text-sm font-medium flex items-center gap-1 px-3 py-2">
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Stats</span>
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="btn-primary text-xs sm:text-sm font-medium px-3 py-2">
                Admin
              </Link>
            )}
            <button onClick={logout} className="btn-danger text-xs sm:text-sm font-medium px-3 py-2">
              Exit
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto p-4 sm:p-8 flex flex-col items-center justify-center gap-4 sm:gap-6">
        {/* Stats Card */}
        <div className="card w-full max-w-sm backdrop-blur-xl shadow-2xl shadow-blue-500/20 border border-slate-600/30 p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/60">
          <div className="space-y-5">
            {/* Score Display */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-700/50">
              <span className="text-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider">Score</span>
              <span className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-300 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                {score}
              </span>
            </div>
            
            {/* Time Display */}
            {gameStarted && !gameOver && (
              <div className="flex items-center justify-between py-4 px-4 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 rounded-xl border border-emerald-500/30 backdrop-blur shadow-lg">
                <span className="text-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider">Timer</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 drop-shadow-md">{gameTime}s</span>
              </div>
            )}
            
            {/* Start Button */}
            {!gameStarted && !gameOver && (
              <button
                onClick={startGame}
                className="btn-success w-full mt-8 text-lg sm:text-xl font-black py-5 sm:py-6 relative overflow-hidden group rounded-xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <span>START GAME</span>
                </span>
              </button>
            )}
            
            {/* Game Over State */}
            {gameOver && (
              <div className="space-y-5 mt-8">
                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur shadow-lg">
                  <p className="text-3xl sm:text-4xl font-black mb-2">{score > 0 ? '🎉' : '👻'}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text">
                    {score > 0 ? 'Game Over!' : 'Caught!'}
                  </p>
                  <p className="text-slate-300 text-sm mt-3">
                    {score > 0 ? 'Great job collecting dots!' : 'A ghost caught you!'}
                  </p>
                </div>
                <button
                  onClick={restartGame}
                  className="btn-success w-full text-lg sm:text-xl font-black py-5 relative overflow-hidden group rounded-xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <span>PLAY AGAIN</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center w-full px-4">
          <div className="relative w-full rounded-3xl overflow-hidden max-w-md">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-50 animate-pulse" style={{animationDuration: '4s'}}></div>
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="relative w-full block border-4 border-blue-400/60 rounded-3xl touch-none shadow-2xl shadow-blue-500/40 bg-gradient-to-br from-slate-800 to-slate-900"
            />
          </div>
        </div>

        {/* Control Type Selector */}
        {isMobile && gameStarted && (
          <div className="w-full max-w-2xl mx-auto mb-6 px-4">
            <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 backdrop-blur rounded-2xl p-4 border border-slate-600/50 shadow-lg">
              <p className="text-slate-300 text-xs text-center mb-4 font-semibold uppercase tracking-wider">Choose Control Style</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setControlType(controlType === 'joystick' ? null : 'joystick')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 transform ${
                    controlType === null || controlType === 'joystick'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 active:scale-95'
                  }`}
                >
                  <div className="text-xl mb-1">🕹️</div>
                  <div>Joystick</div>
                </button>
                <button
                  onClick={() => setControlType(controlType === 'dpad' ? null : 'dpad')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 transform ${
                    controlType === 'dpad'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 active:scale-95'
                  }`}
                >
                  <div className="text-xl mb-1">⬆️</div>
                  <div>D-Pad</div>
                </button>
                <button
                  onClick={() => setControlType(controlType === 'touchpad' ? null : 'touchpad')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 transform ${
                    controlType === 'touchpad'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 active:scale-95'
                  }`}
                >
                  <div className="text-xl mb-1">📱</div>
                  <div>Touchpad</div>
                </button>
                <button
                  onClick={() => setControlType(controlType === 'swipe' ? null : 'swipe')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 transform ${
                    controlType === 'swipe'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 active:scale-95'
                  }`}
                >
                  <div className="text-xl mb-1">👆</div>
                  <div>Swipe</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Joystick Controls */}
        {isJoystickActive && (
          <div className="flex justify-center w-full mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-3">
              <Joystick onDirectionChange={handleJoystickDirection} size={160} />
              <p className="text-xs text-slate-400 font-semibold uppercase">Use Joystick</p>
            </div>
          </div>
        )}

        {/* D-Pad Controls */}
        {isDPadActive && (
          <div className="flex justify-center w-full mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-3">
              <DPad onDirectionChange={handleJoystickDirection} size={160} />
              <p className="text-xs text-slate-400 font-semibold uppercase">Use D-Pad</p>
            </div>
          </div>
        )}

        {/* Touchpad Controls */}
        {isTouchpadActive && (
          <div className="flex justify-center w-full mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-3">
              <Touchpad onDirectionChange={handleJoystickDirection} width={300} height={240} />
              <p className="text-xs text-slate-400 font-semibold uppercase">Swipe to Move</p>
            </div>
          </div>
        )}

        {/* Swipe Instructions */}
        {isSwipeActive && (
          <div className="flex justify-center w-full mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-4 px-4">
              <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 backdrop-blur rounded-2xl p-6 border border-slate-600/50 text-center max-w-sm">
                <p className="text-3xl mb-3">👆</p>
                <p className="text-sm text-slate-300 font-semibold">Swipe on the game area to move Pac-Man</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 sm:mt-8 text-center text-gray-300">
          <p className="text-sm sm:text-base mb-1 sm:mb-2 font-semibold">
            {!isMobile ? (
              'Use Arrow Keys to Move'
            ) : isJoystickActive ? (
              '🕹️ Move the Joystick'
            ) : isDPadActive ? (
              '⬆️ Press Arrow Buttons'
            ) : isTouchpadActive ? (
              '📱 Swipe on Touchpad'
            ) : (
              '👆 Swipe to Move'
            )}
          </p>
          <p className="text-xs sm:text-sm">🟡 Collect all dots and avoid the ghosts! 👻</p>
        </div>
      </div>
    </div>
  );
};
