import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Zap, Shield } from 'lucide-react';

export function StellarStrikeGame({ game, onScoreSubmit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const stateRef = useRef({
    paddle: { x: 250, width: 90, height: 12, speed: 8 },
    ball: { x: 300, y: 350, radius: 6, vx: 4, vy: -4, active: true },
    blocks: [],
    score: 0,
    lives: 3,
    keys: {},
    startTime: 0,
  });

  const startGame = () => {
    stateRef.current.score = 0;
    stateRef.current.lives = 3;
    stateRef.current.paddle.x = 250;
    stateRef.current.ball = { x: 300, y: 350, radius: 6, vx: 4, vy: -4, active: true };
    stateRef.current.startTime = Date.now();
    setupBlocks();
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  const setupBlocks = () => {
    const blocks = [];
    const rows = 4;
    const cols = 8;
    const blockW = 60;
    const blockH = 20;
    const padding = 10;
    const offsetLeft = 40;
    const offsetTop = 40;

    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        blocks.push({
          x: offsetLeft + c * (blockW + padding),
          y: offsetTop + r * (blockH + padding),
          width: blockW,
          height: blockH,
          color: colors[r],
          points: (4 - r) * 100,
          active: true,
        });
      }
    }
    stateRef.current.blocks = blocks;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.code] = true;
      if (['Space', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    };
    const handleKeyUp = (e) => {
      stateRef.current.keys[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const loop = () => {
      const state = stateRef.current;
      const { paddle, ball, blocks, keys } = state;

      // Paddle movement
      if (keys['ArrowLeft'] || keys['KeyA']) paddle.x = Math.max(10, paddle.x - paddle.speed);
      if (keys['ArrowRight'] || keys['KeyD']) paddle.x = Math.min(canvas.width - paddle.width - 10, paddle.x + paddle.speed);

      // Ball movement
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall bounces
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
      }
      if (ball.y - ball.radius < 0) {
        ball.vy = -ball.vy;
      }

      // Paddle bounce
      if (
        ball.y + ball.radius >= canvas.height - 30 &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.vy = -Math.abs(ball.vy);
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.vx = hitPos * 5;
      }

      // Bottom fall
      if (ball.y + ball.radius > canvas.height) {
        state.lives--;
        setLives(state.lives);
        if (state.lives <= 0) {
          handleGameOver();
          return;
        } else {
          // Reset ball
          ball.x = paddle.x + paddle.width / 2;
          ball.y = canvas.height - 50;
          ball.vy = -4;
          ball.vx = (Math.random() - 0.5) * 6;
        }
      }

      // Block collisions
      blocks.forEach((b) => {
        if (!b.active) return;
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + b.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + b.height
        ) {
          b.active = false;
          ball.vy = -ball.vy;
          state.score += b.points;
          setScore(state.score);
        }
      });

      // Check all blocks destroyed
      if (blocks.every((b) => !b.active)) {
        setupBlocks();
        state.score += 1000;
        setScore(state.score);
      }

      // Render
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blocks
      blocks.forEach((b) => {
        if (!b.active) return;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Paddle
      ctx.fillStyle = '#8b5cf6';
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 15;
      ctx.fillRect(paddle.x, canvas.height - 30, paddle.width, paddle.height);

      // Ball
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(loop);
    };

    const handleGameOver = () => {
      const finalScore = stateRef.current.score;
      const duration = Math.round((Date.now() - stateRef.current.startTime) / 1000);
      setGameState('gameover');
      if (onScoreSubmit) {
        onScoreSubmit({
          gameId: game._id,
          score: finalScore,
          duration,
          completed: false,
        });
      }
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, game, onScoreSubmit]);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-gaming-purple/40 bg-gaming-dark/95 p-4 shadow-2xl overflow-hidden">
      {/* HUD */}
      <div className="flex w-full items-center justify-between px-4 py-2 border-b border-white/10 text-sm font-semibold mb-3">
        <div className="flex items-center gap-1.5 text-gaming-purple font-orbitron">
          <Zap className="h-4 w-4" />
          <span>SCORE: {score}</span>
        </div>
        <div className="flex items-center gap-1 text-gaming-pink">
          <Shield className="h-4 w-4" />
          <span>SHIELDS: {'🛡️'.repeat(Math.max(0, lives))}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={440}
          className="rounded-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] max-w-full"
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl p-6 text-center">
            <h2 className="text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-gaming-purple to-pink-500 mb-3">
              STELLAR STRIKE
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Defend orbital laser grids and ricochet plasma spheres to demolish alien barricades!
            </p>
            <Button size="lg" onClick={startGame} className="bg-gaming-blue hover:bg-gaming-blue/90 font-orbitron px-8">
              <Play className="h-5 w-5 mr-2" />
              DEPLOY DEFENSE
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-xl p-6 text-center animate-in fade-in">
            <h2 className="text-3xl font-black font-orbitron text-destructive mb-2">
              ORBITAL BREACH!
            </h2>
            <div className="text-3xl font-black text-gaming-cyan font-orbitron my-2">{score} PTS</div>
            <Button size="lg" onClick={startGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron mt-4">
              <RotateCcw className="h-5 w-5 mr-2" />
              PLAY AGAIN
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-3">
        Use Arrow Keys or A/D to position the orbital deflector.
      </div>
    </div>
  );
}

export default StellarStrikeGame;
