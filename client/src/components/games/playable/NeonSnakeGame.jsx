import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Zap, Sparkles } from 'lucide-react';

const GRID_SIZE = 20;

export function NeonSnakeGame({ game, onScoreSubmit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const stateRef = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: { x: 5, y: 5, type: 'normal' },
    score: 0,
    speed: 110,
    startTime: 0,
  });

  const startGame = () => {
    stateRef.current.snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    stateRef.current.dir = { x: 0, y: -1 };
    stateRef.current.nextDir = { x: 0, y: -1 };
    stateRef.current.score = 0;
    stateRef.current.speed = 110;
    stateRef.current.startTime = Date.now();
    spawnFood();
    setScore(0);
    setGameState('playing');
  };

  const spawnFood = () => {
    const isSpecial = Math.random() < 0.25;
    stateRef.current.food = {
      x: Math.floor(Math.random() * (480 / GRID_SIZE)),
      y: Math.floor(Math.random() * (480 / GRID_SIZE)),
      type: isSpecial ? 'special' : 'normal',
    };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { dir } = stateRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && dir.y === 0) {
        e.preventDefault();
        stateRef.current.nextDir = { x: 0, y: -1 };
      } else if ((e.key === 'ArrowDown' || e.key === 's') && dir.y === 0) {
        e.preventDefault();
        stateRef.current.nextDir = { x: 0, y: 1 };
      } else if ((e.key === 'ArrowLeft' || e.key === 'a') && dir.x === 0) {
        e.preventDefault();
        stateRef.current.nextDir = { x: -1, y: 0 };
      } else if ((e.key === 'ArrowRight' || e.key === 'd') && dir.x === 0) {
        e.preventDefault();
        stateRef.current.nextDir = { x: 1, y: 0 };
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let gameInterval;

    const tick = () => {
      const state = stateRef.current;
      state.dir = state.nextDir;

      const head = {
        x: state.snake[0].x + state.dir.x,
        y: state.snake[0].y + state.dir.y,
      };

      const maxGrid = 480 / GRID_SIZE;

      // Wall collision or self collision
      if (
        head.x < 0 ||
        head.x >= maxGrid ||
        head.y < 0 ||
        head.y >= maxGrid ||
        state.snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        handleGameOver();
        return;
      }

      state.snake.unshift(head);

      // Check food
      if (head.x === state.food.x && head.y === state.food.y) {
        const points = state.food.type === 'special' ? 250 : 100;
        state.score += points;
        setScore(state.score);
        state.speed = Math.max(60, state.speed - 2);
        spawnFood();
      } else {
        state.snake.pop();
      }

      // Draw
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, 480, 480);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 480; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 480);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(480, i);
        ctx.stroke();
      }

      // Draw Food
      ctx.shadowBlur = 15;
      if (state.food.type === 'special') {
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
      } else {
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
      }
      ctx.beginPath();
      ctx.arc(
        state.food.x * GRID_SIZE + GRID_SIZE / 2,
        state.food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake
      state.snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#8b5cf6' : '#a855f7';
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = isHead ? 15 : 6;
        ctx.fillRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        );
      });

      ctx.shadowBlur = 0;
    };

    const handleGameOver = () => {
      clearInterval(gameInterval);
      setGameState('gameover');
      const finalScore = stateRef.current.score;
      const duration = Math.round((Date.now() - stateRef.current.startTime) / 1000);
      if (finalScore > highScore) setHighScore(finalScore);
      if (onScoreSubmit) {
        onScoreSubmit({
          gameId: game._id,
          score: finalScore,
          duration,
          completed: false,
        });
      }
    };

    gameInterval = setInterval(tick, stateRef.current.speed);
    return () => clearInterval(gameInterval);
  }, [gameState, game, highScore, onScoreSubmit]);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-gaming-purple/40 bg-gaming-dark/95 p-4 shadow-2xl overflow-hidden">
      {/* HUD */}
      <div className="flex w-full items-center justify-between px-4 py-2 border-b border-white/10 text-sm font-semibold mb-3">
        <div className="flex items-center gap-1.5 text-gaming-purple font-orbitron">
          <Zap className="h-4 w-4" />
          <span>SCORE: {score}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gaming-cyan font-orbitron">
          <Sparkles className="h-4 w-4" />
          <span>MATRIX ENERGY</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="rounded-xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)] max-w-full"
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl p-6 text-center">
            <h2 className="text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple via-gaming-cyan to-pink-500 mb-3">
              NEON MATRIX SNAKE
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Consume photon nodes, accelerate through the neural grid, and out-maneuver your own plasma tail.
            </p>
            <Button size="lg" onClick={startGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron px-8">
              <Play className="h-5 w-5 mr-2" />
              START GAME
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-xl p-6 text-center animate-in fade-in">
            <h2 className="text-3xl font-black font-orbitron text-destructive mb-2">
              GRID COLLAPSED!
            </h2>
            <div className="text-3xl font-black text-gaming-cyan font-orbitron my-2">{score} PTS</div>
            <Button size="lg" onClick={startGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron mt-4">
              <RotateCcw className="h-5 w-5 mr-2" />
              RETRY MATRIX
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-3">
        Use Arrow Keys or WASD to navigate. Pink nodes provide bonus points!
      </div>
    </div>
  );
}

export default NeonSnakeGame;
