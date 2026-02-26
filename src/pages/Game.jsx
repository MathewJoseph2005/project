import { useEffect, useRef, useState } from 'react';
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
  const [useJoystick, setUseJoystick] = useState(false);
  const [controlType, setControlType] = useState('swipe'); // 'swipe', 'joystick', 'dpad', 'touchpad'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const gameStateRef = useRef({});
  const gameStartTimeRef = useRef(null);
  const pacmanDirectionRef = useRef('right');

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Handle joystick direction changes
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
      const isTablet = window.innerWidth < 1024;
      
      setIsMobile(isMobileScreen);
      
      if (isMobileScreen) {
        setCanvasSize(Math.min(window.innerWidth - 32, 300));
      } else if (isTablet) {
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

    const isWall = (x, y) => {
      return walls.some(wall => wall.x === x && wall.y === y);
    };

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      walls.forEach(wall => {
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(wall.x * gridSize, wall.y * gridSize, gridSize, gridSize);
      });

      dots.forEach(dot => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(
          dot.x * gridSize + gridSize / 2,
          dot.y * gridSize + gridSize / 2,
          3,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(
        pacman.x * gridSize + gridSize / 2,
        pacman.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0.2 * Math.PI,
        1.8 * Math.PI
      );
      ctx.lineTo(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2);
      ctx.fill();

      ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(
          ghost.x * gridSize + gridSize / 2,
          ghost.y * gridSize + gridSize / 2,
          gridSize / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    };

    const movePacman = () => {
      let newX = pacman.x;
      let newY = pacman.y;

      if (pacman.direction === 'up') newY -= 1;
      if (pacman.direction === 'down') newY += 1;
      if (pacman.direction === 'left') newX -= 1;
      if (pacman.direction === 'right') newX += 1;

      if (!isWall(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;

        const dotIndex = dots.findIndex(dot => dot.x === newX && dot.y === newY);
        if (dotIndex !== -1) {
          dots.splice(dotIndex, 1);
          setScore(prev => prev + 10);
        }

        if (dots.length === 0) {
          setGameOver(true);
        }
      }
    };

    const moveGhosts = () => {
      ghosts.forEach(ghost => {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];

        let newX = ghost.x;
        let newY = ghost.y;

        if (randomDir === 'up') newY -= 1;
        if (randomDir === 'down') newY += 1;
        if (randomDir === 'left') newX -= 1;
        if (randomDir === 'right') newX += 1;

        if (!isWall(newX, newY)) {
          ghost.x = newX;
          ghost.y = newY;
        }

        if (ghost.x === pacman.x && ghost.y === pacman.y) {
          setGameOver(true);
        }
      });
    };

    const handleKeyPress = (e) => {
      const keys = { 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right' };
      if (keys[e.key]) {
        pacman.direction = keys[e.key];
        e.preventDefault();
      }
    };

    const handleTouchStart = (e) => {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const minDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
        pacman.direction = deltaX > 0 ? 'right' : 'left';
        e.preventDefault();
      } else if (Math.abs(deltaY) > minDistance) {
        pacman.direction = deltaY > 0 ? 'down' : 'up';
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    const gameLoop = setInterval(() => {
      if (!gameOver) {
        movePacman();
        moveGhosts();
        draw();
      }
    }, 200);

    draw();

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStarted, gameOver, canvasSize]);

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

  // Record game stats when game ends
  useEffect(() => {
    if (gameOver && gameStarted) {
      const duration = gameTime;
      const won = score > 0; // Won if collected at least one dot
      perfMonitor.recordGameSession(score, duration, won);
    }
  }, [gameOver]);

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
            <span className="text-xs sm:text-sm text-slate-300 px-3 py-1 bg-slate-700/30 rounded-full flex-shrink-0">👤 {user?.username}</span>
            <Link
              to="/stats"
              className="btn-secondary text-xs sm:text-sm font-medium flex items-center gap-1 px-3 py-2"
            >
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Stats</span>
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="btn-primary text-xs sm:text-sm font-medium px-3 py-2"
              >
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="btn-danger text-xs sm:text-sm font-medium px-3 py-2"
            >
              Exit
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto p-4 sm:p-8 flex flex-col items-center justify-center">
        {/* Stats Card */}
        <div className="card mb-8 max-w-sm w-full p-6 sm:p-8 border-slate-700/50 backdrop-blur-xl shadow-xl shadow-blue-500/10">
          <div className="space-y-4">
            {/* Score Display */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
              <span className="text-slate-300 text-sm font-semibold uppercase tracking-wider">Score</span>
              <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-400 bg-clip-text text-transparent">{score}</span>
            </div>
            
            {/* Time Display */}
            {gameStarted && !gameOver && (
              <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/20">
                <span className="text-slate-300 text-sm font-semibold">⏱️ Timer</span>
                <span className="text-3xl font-bold text-emerald-400">{gameTime}s</span>
              </div>
            )}
            
            {/* Start Button */}
            {!gameStarted && !gameOver && (
              <button
                onClick={startGame}
                className="btn-success w-full mt-6 text-lg font-bold py-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="relative flex items-center justify-center gap-2">
                  🎮 Start Game
                </span>
              </button>
            )}
            
            {/* Game Over State */}
            {gameOver && (
              <div className="space-y-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <p className="text-2xl sm:text-3xl font-bold">{score > 0 ? '🎉 Game Over!' : '👻 Caught!'}</p>
                  <p className="text-slate-300 text-sm mt-2">{score > 0 ? 'Great job collecting dots!' : 'A ghost caught you!'}</p>
                </div>
                <button
                  onClick={restartGame}
                  className="btn-success w-full text-lg font-bold py-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    🔄 Play Again
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center mb-8 relative w-full max-w-md mx-auto">
          <div className="relative w-full px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur-2xl opacity-30 transition-opacity duration-300"></div>
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="relative w-full block border-2 border-blue-500/60 rounded-2xl touch-none shadow-xl shadow-blue-500/30 bg-gradient-to-br from-slate-700/50 to-slate-600/50"
              style={{ maxWidth: '100%', height: 'auto', aspectRatio: '1' }}
            />
          </div>
        </div>

          {/* Control Type Selector for Mobile */}
          {isMobile && gameStarted && (
            <div className="mb-6 w-full max-w-md mx-auto">
              <p className="text-slate-400 text-xs text-center mb-3 font-semibold">Choose your control style:</p>
              <div className="flex gap-2 justify-center flex-wrap px-4">
                <button
                  onClick={() => setControlType('swipe')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    controlType === 'swipe'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  👆 Swipe
                </button>
                <button
                  onClick={() => setControlType('joystick')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                    controlType === 'joystick'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  <Gamepad2 size={14} /> Stick
                </button>
                <button
                  onClick={() => setControlType('dpad')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    controlType === 'dpad'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  ↑↓← D-Pad
                </button>
                <button
                  onClick={() => setControlType('touchpad')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    controlType === 'touchpad'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  📱 Pad
                </button>
              </div>
            </div>
          )}

          {/* Joystick Controls */}
          {isMobile && gameStarted && controlType === 'joystick' && (
            <div className="flex justify-center mb-4 sm:mb-6">
              <Joystick onDirectionChange={handleJoystickDirection} size={140} />
            </div>
          )}

          {/* D-Pad Controls */}
          {isMobile && gameStarted && controlType === 'dpad' && (
            <div className="flex justify-center mb-4 sm:mb-6">
              <DPad onDirectionChange={handleJoystickDirection} size={140} />
            </div>
          )}

          {/* Touchpad Controls */}
          {isMobile && gameStarted && controlType === 'touchpad' && (
            <div className="flex justify-center mb-4 sm:mb-6">
              <Touchpad onDirectionChange={handleJoystickDirection} width={280} height={200} />
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center text-gray-300">
            <p className="text-sm sm:text-base mb-1 sm:mb-2">
              <span className="hidden sm:inline">Use Arrow Keys to Move</span>
              <span className="sm:hidden">
                {controlType === 'swipe' ? 'Swipe to Move' : (controlType === 'joystick' ? 'Use Joystick' : (controlType === 'dpad' ? 'Use D-Pad' : 'Swipe on Touchpad'))}
              </span>
            </p>
            <p className="text-xs sm:text-sm">Collect all dots and avoid the ghosts!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
