import React, { useEffect, useRef, useState } from 'react';

export const Joystick = ({ onDirectionChange, size = 120 }) => {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0 });
  const directionRef = useRef('right');

  const radius = size / 2;
  const stickRadius = size / 6;

  // Calculate direction based on stick position
  const getDirection = (x, y) => {
    const angle = Math.atan2(y, x);
    
    // Divide circle into 4 quadrants + 8 directions for better control
    const normalized = (angle + Math.PI) / (2 * Math.PI);
    
    if (Math.abs(x) < 10 && Math.abs(y) < 10) return 'idle';
    
    // Priority: up/down if more vertical, left/right if more horizontal
    if (Math.abs(y) > Math.abs(x)) {
      return y > 0 ? 'down' : 'up';
    } else {
      return x > 0 ? 'right' : 'left';
    }
  };

  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    touchStartRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    setIsActive(true);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isActive || !containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let x = touch.clientX - rect.left - centerX;
    let y = touch.clientY - rect.top - centerY;
    
    // Limit to circle radius
    const distance = Math.sqrt(x * x + y * y);
    if (distance > radius) {
      x = (x / distance) * radius;
      y = (y / distance) * radius;
    }
    
    setPosition({ x, y });
    
    const direction = getDirection(x, y);
    if (direction !== 'idle' && direction !== directionRef.current) {
      directionRef.current = direction;
      onDirectionChange(direction);
    }
    
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsActive(false);
    setPosition({ x: 0, y: 0 });
    directionRef.current = 'right';
    onDirectionChange('idle');
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive]);

  const getDirectionArrow = () => {
    switch (directionRef.current) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'left': return '←';
      case 'right': return '→';
      default: return '●';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-full flex items-center justify-center select-none transition-all duration-200 shadow-xl ${
        isActive
          ? 'bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 shadow-blue-500/60 scale-110'
          : 'bg-gradient-to-br from-slate-700/90 to-slate-600/90 hover:from-slate-700 hover:to-slate-600 shadow-slate-900/60 border border-slate-500/30'
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        touchAction: 'none',
        cursor: 'grab',
        boxShadow: isActive 
          ? '0 0 30px rgba(59, 130, 246, 0.6), 0 0 50px rgba(34, 197, 94, 0.2)'
          : '0 0 20px rgba(15, 23, 42, 0.8)'
      }}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer circle with gradient ring */}
      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 opacity-60" />
      <div className="absolute inset-1 rounded-full border border-blue-400/10 opacity-40" />
      
      {/* Direction indicators with better styling */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="text-center text-slate-200 font-bold">
          <div className="text-sm leading-none mb-1">↑</div>
          <div className="flex gap-2 justify-center">
            <div className="text-sm">←</div>
            <div className="text-sm">→</div>
          </div>
          <div className="text-sm leading-none mt-1">↓</div>
        </div>
      </div>

      {/* Center stick with enhanced effects */}
      <div
        className={`absolute rounded-full flex items-center justify-center font-bold text-white transition-all duration-100 shadow-lg ${
          isActive 
            ? 'bg-gradient-to-br from-cyan-300 via-blue-400 to-cyan-500 shadow-cyan-400/70' 
            : 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-900/50'
        }`}
        style={{
          width: `${stickRadius * 2}px`,
          height: `${stickRadius * 2}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
          fontSize: `${stickRadius * 0.8}px`,
          lineHeight: 1,
          boxShadow: isActive
            ? `0 0 20px rgba(34, 211, 238, 0.8), inset -2px -2px 10px rgba(0, 0, 0, 0.3)`
            : 'inset -2px -2px 5px rgba(0, 0, 0, 0.3)'
        }}
      >
        {getDirectionArrow()}
      </div>
    </div>
  );
};

// Alternative: D-Pad style control
export const DPad = ({ onDirectionChange, size = 120 }) => {
  const [active, setActive] = useState(null);

  const handlePress = (direction) => {
    setActive(direction);
    onDirectionChange(direction);
  };

  const handleRelease = () => {
    setActive(null);
    onDirectionChange('idle');
  };

  const buttonSize = size / 3;

  const Button = ({ direction, top, left, children }) => (
    <button
      onMouseDown={() => handlePress(direction)}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={(e) => { e.preventDefault(); handlePress(direction); }}
      onTouchEnd={handleRelease}
      className={`absolute rounded-xl transition-all duration-150 font-bold text-white select-none shadow-md active:shadow-inner ${
        active === direction
          ? 'bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 shadow-lg shadow-blue-400/60 scale-90'
          : 'bg-gradient-to-br from-slate-700/90 to-slate-600/90 hover:from-slate-700 hover:to-slate-600 shadow-slate-900/50 hover:shadow-md border border-slate-500/20'
      }`}
      style={{
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        top: `${top}px`,
        left: `${left}px`,
        fontSize: `${buttonSize * 0.45}px`,
        minHeight: '44px',
        boxShadow: active === direction
          ? `0 0 15px rgba(59, 130, 246, 0.6), inset -2px -2px 5px rgba(0, 0, 0, 0.3)`
          : 'none'
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="relative"
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      <Button direction="up" top={0} left={buttonSize} children="↑" />
      <Button direction="left" top={buttonSize} left={0} children="←" />
      <Button direction="right" top={buttonSize} left={buttonSize * 2} children="→" />
      <Button direction="down" top={buttonSize * 2} left={buttonSize} children="↓" />
    </div>
  );
};

// Touchpad style control (large drag area)
export const Touchpad = ({ onDirectionChange, width = 200, height = 200 }) => {
  const padRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const lastDirectionRef = useRef('right');

  const handleTouchStart = (e) => {
    setIsActive(true);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isActive || !padRef.current) return;

    const touch = e.touches[0];
    const rect = padRef.current.getBoundingClientRect();

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = width / 2;
    const centerY = height / 2;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const threshold = 20; // Minimum movement to register

    if (distance < threshold) {
      if (lastDirectionRef.current !== 'idle') {
        lastDirectionRef.current = 'idle';
        onDirectionChange('idle');
      }
      return;
    }

    let direction;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      direction = deltaY > 0 ? 'down' : 'up';
    } else {
      direction = deltaX > 0 ? 'right' : 'left';
    }

    if (direction !== lastDirectionRef.current) {
      lastDirectionRef.current = direction;
      onDirectionChange(direction);
    }

    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsActive(false);
    lastDirectionRef.current = 'right';
    onDirectionChange('idle');
  };

  return (
    <div
      ref={padRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`rounded-3xl border flex items-center justify-center select-none transition-all duration-200 shadow-xl ${
        isActive
          ? 'bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 border-cyan-400 shadow-blue-500/60 scale-105'
          : 'bg-gradient-to-br from-slate-700/90 to-slate-600/90 border-slate-600/50 hover:from-slate-700 hover:to-slate-600 shadow-slate-900/60'
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        touchAction: 'none',
        cursor: 'pointer',
        boxShadow: isActive
          ? '0 0 30px rgba(59, 130, 246, 0.6), 0 0 50px rgba(34, 197, 94, 0.2)'
          : '0 0 20px rgba(15, 23, 42, 0.8)'
      }}
    >
      <div className="text-center text-slate-200 pointer-events-none">
        <div className="text-5xl mb-3 drop-shadow-lg">👆</div>
        <div className="text-sm font-bold uppercase tracking-wider opacity-75">Swipe</div>
        <div className="text-xs text-slate-300 mt-2">Move & Control</div>
      </div>
    </div>
  );
};
