import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from '../components/Router';

export const Game = () => {
  const canvasRef = useRef(null);
  const { user, logout } = useAuth();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const canvasSize = 400;

    let pacman = { x: 1, y: 1, direction: 'right' };
    let dots = [];
    let walls = [];
    let ghosts = [
      { x: 18, y: 1, color: '#FF0000' },
      { x: 1, y: 18, color: '#FFB8FF' },
      { x: 18, y: 18, color: '#00FFFF' }
    ];

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
      if (e.key === 'ArrowUp') pacman.direction = 'up';
      if (e.key === 'ArrowDown') pacman.direction = 'down';
      if (e.key === 'ArrowLeft') pacman.direction = 'left';
      if (e.key === 'ArrowRight') pacman.direction = 'right';
    };

    window.addEventListener('keydown', handleKeyPress);

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
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
  };

  const restartGame = () => {
    setGameStarted(false);
    setTimeout(() => startGame(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pac-Man Game</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.username}!</span>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8 flex flex-col items-center">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Score: {score}</h2>
            {!gameStarted && !gameOver && (
              <button
                onClick={startGame}
                className="bg-green-600 px-8 py-3 rounded-lg text-xl font-bold hover:bg-green-700 transition"
              >
                Start Game
              </button>
            )}
            {gameOver && (
              <div className="space-y-4">
                <p className="text-2xl text-yellow-400">
                  {score > 0 ? 'Game Over!' : 'Caught by Ghost!'}
                </p>
                <button
                  onClick={restartGame}
                  className="bg-green-600 px-8 py-3 rounded-lg text-xl font-bold hover:bg-green-700 transition"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="border-4 border-blue-500 rounded-lg"
          />

          <div className="mt-6 text-center text-gray-300">
            <p className="text-lg mb-2">Use Arrow Keys to Move</p>
            <p className="text-sm">Collect all dots and avoid the ghosts!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
