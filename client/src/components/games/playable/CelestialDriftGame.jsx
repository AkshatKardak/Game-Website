import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Zap, Compass, Flame } from 'lucide-react';

export function CelestialDriftGame({ game, onScoreSubmit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [boostGauge, setBoostGauge] = useState(100);

  const stateRef = useRef({
    player: { x: 300, y: 380, width: 34, height: 42, speed: 7 },
    obstacles: [],
    orbs: [],
    speed: 5,
    distance: 0,
    score: 0,
    boost: 100,
    isBoosting: false,
    keys: {},
    startTime: 0,
  });

  const startGame = () => {
    stateRef.current.player.x = 300;
    stateRef.current.obstacles = [];
    stateRef.current.orbs = [];
    stateRef.current.speed = 5;
    stateRef.current.distance = 0;
    stateRef.current.score = 0;
    stateRef.current.boost = 100;
    stateRef.current.isBoosting = false;
    stateRef.current.startTime = Date.now();
    setScore(0);
    setDistance(0);
    setBoostGauge(100);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft'].includes(e.code)) {
        e.preventDefault();
      }
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
    let frame = 0;

    const loop = () => {
      frame++;
      const state = stateRef.current;
      const { player, keys, obstacles, orbs } = state;

      // Handle Boost
      if (keys['ShiftLeft'] || keys['Space']) {
        if (state.boost > 0) {
          state.isBoosting = true;
          state.boost = Math.max(0, state.boost - 0.7);
        } else {
          state.isBoosting = false;
        }
      } else {
        state.isBoosting = false;
        state.boost = Math.min(100, state.boost + 0.3);
      }
      setBoostGauge(Math.round(state.boost));

      const currentSpeed = state.isBoosting ? state.speed * 1.8 : state.speed;
      state.speed += 0.001; // Gradual acceleration
      state.distance += Math.round(currentSpeed);
      state.score += state.isBoosting ? 3 : 1;
      setScore(state.score);
      setDistance(Math.round(state.distance / 10));

      // Player Movement
      if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(20, player.x - player.speed);
      if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.width - 20, player.x + player.speed);

      // Spawn Obstacles (Asteroids)
      if (frame % Math.max(20, 50 - Math.floor(state.speed * 2)) === 0) {
        obstacles.push({
          x: 20 + Math.random() * (canvas.width - 80),
          y: -50,
          radius: 18 + Math.random() * 20,
          vy: currentSpeed + Math.random() * 2,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.05,
        });
      }

      // Spawn Energy Orbs
      if (frame % 45 === 0) {
        orbs.push({
          x: 40 + Math.random() * (canvas.width - 80),
          y: -30,
          radius: 9,
          vy: currentSpeed,
        });
      }

      // Clear & Background
      ctx.fillStyle = '#060712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Speed lines
      ctx.strokeStyle = state.isBoosting ? 'rgba(236, 72, 153, 0.4)' : 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = state.isBoosting ? 2 : 1;
      for (let i = 0; i < 15; i++) {
        const lx = (i * 45 + frame * 3) % canvas.width;
        const ly = (frame * currentSpeed * 2 + i * 80) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx, ly + 25);
        ctx.stroke();
      }

      // Update & Draw Orbs
      for (let i = orbs.length - 1; i >= 0; i--) {
        const o = orbs[i];
        o.y += o.vy;

        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
        ctx.fill();

        // Collision with player
        const dx = (player.x + player.width / 2) - o.x;
        const dy = (player.y + player.height / 2) - o.y;
        if (Math.hypot(dx, dy) < player.width / 2 + o.radius) {
          state.score += 200;
          state.boost = Math.min(100, state.boost + 25);
          orbs.splice(i, 1);
          continue;
        }

        if (o.y > canvas.height + 40) orbs.splice(i, 1);
      }

      // Update & Draw Obstacles
      ctx.shadowBlur = 0;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obs.vy;
        obs.rotation += obs.vRot;

        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rotation);
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const r = obs.radius * (0.8 + Math.sin(a * 3) * 0.2);
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Collision Check
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        if (Math.hypot(pCenterX - obs.x, pCenterY - obs.y) < obs.radius + player.width / 3) {
          handleCrash();
          return;
        }

        if (obs.y > canvas.height + 60) obstacles.splice(i, 1);
      }

      // Draw Player Racer
      ctx.shadowBlur = 15;
      ctx.shadowColor = state.isBoosting ? '#ec4899' : '#8b5cf6';
      ctx.fillStyle = state.isBoosting ? '#ec4899' : '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(player.x + player.width * 0.5, player.y + player.height * 0.7);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // Exhaust Trail
      ctx.fillStyle = state.isBoosting ? '#fbbf24' : '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(player.x + player.width * 0.3, player.y + player.height);
      ctx.lineTo(player.x + player.width * 0.5, player.y + player.height + (state.isBoosting ? 28 : 14));
      ctx.lineTo(player.x + player.width * 0.7, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(loop);
    };

    const handleCrash = () => {
      const finalScore = stateRef.current.score;
      const duration = Math.round((Date.now() - stateRef.current.startTime) / 1000);
      setGameState('gameover');
      if (onScoreSubmit) {
        onScoreSubmit({
          gameId: game._id,
          score: finalScore,
          duration,
          completed: false,
          extraStats: { distance: stateRef.current.distance },
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-gaming-purple font-orbitron">
            <Zap className="h-4 w-4" />
            <span>SCORE: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gaming-cyan font-orbitron">
            <Compass className="h-4 w-4" />
            <span>DISTANCE: {distance}m</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-gaming-pink" />
          <div className="w-28 h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-gaming-pink to-amber-400 transition-all"
              style={{ width: `${boostGauge}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="rounded-xl border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.2)] max-w-full"
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl p-6 text-center">
            <h2 className="text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gaming-pink via-gaming-purple to-cyan-400 mb-3">
              CELESTIAL DRIFT
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Navigate hyperspace corridors, collect golden quantum energy orbs, and dodge catastrophic asteroid storms!
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-300 mb-6 flex gap-6">
              <span>⬅️ ➡️ / A D: Steer Racer</span>
              <span>SHIFT / SPACE: Quantum Boost</span>
            </div>
            <Button size="lg" onClick={startGame} className="bg-gaming-pink hover:bg-gaming-pink/90 font-orbitron px-8 text-base">
              <Play className="h-5 w-5 mr-2" />
              START DRIFT
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-xl p-6 text-center animate-in fade-in">
            <h2 className="text-4xl font-black font-orbitron text-destructive mb-2">
              ASTEROID COLLISION!
            </h2>
            <p className="text-muted-foreground text-sm mb-4">Your ship was obliterated in the asteroid belt.</p>
            <div className="bg-gaming-card/90 border border-gaming-purple/40 rounded-xl p-4 w-64 mb-6 shadow-xl">
              <div className="text-xs text-muted-foreground">FINAL SCORE</div>
              <div className="text-3xl font-black text-amber-400 font-orbitron my-1">{score}</div>
              <div className="text-xs text-gaming-cyan">Distance: {distance} meters</div>
            </div>
            <Button size="lg" onClick={startGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron">
              <RotateCcw className="h-5 w-5 mr-2" />
              DRIFT AGAIN
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
        <span>Controls: Arrow Keys / A D + Shift for Boost</span>
        <span>•</span>
        <span>Collect yellow orbs to recharge boost & multiply score</span>
      </div>
    </div>
  );
}

export default CelestialDriftGame;
