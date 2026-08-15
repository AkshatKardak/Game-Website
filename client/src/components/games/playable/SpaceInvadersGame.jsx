import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Shield, Zap } from 'lucide-react';

export function SpaceInvadersGame({ game, onScoreSubmit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const stateRef = useRef({
    player: { x: 300, y: 440, width: 36, height: 28, speed: 6, vx: 0 },
    lasers: [],
    enemies: [],
    particles: [],
    keys: {},
    score: 0,
    wave: 1,
    lives: 3,
    lastShot: 0,
    startTime: 0,
  });

  const startGame = () => {
    stateRef.current.score = 0;
    stateRef.current.wave = 1;
    stateRef.current.lives = 3;
    stateRef.current.lasers = [];
    stateRef.current.particles = [];
    stateRef.current.startTime = Date.now();
    stateRef.current.player.x = 300;
    spawnEnemies(1);
    setScore(0);
    setWave(1);
    setLives(3);
    setGameState('playing');
  };

  const spawnEnemies = (currentWave) => {
    const rows = Math.min(2 + currentWave, 5);
    const cols = 8;
    const enemies = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: 60 + c * 60,
          y: 40 + r * 45,
          width: 32,
          height: 24,
          type: r === 0 ? 'elite' : r === 1 ? 'commander' : 'scout',
          color: r === 0 ? '#ec4899' : r === 1 ? '#8b5cf6' : '#06b6d4',
          hp: r === 0 ? 3 : 1,
          points: r === 0 ? 300 : r === 1 ? 150 : 80,
          vx: 1 + currentWave * 0.3,
        });
      }
    }
    stateRef.current.enemies = enemies;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
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

    const loop = () => {
      const state = stateRef.current;
      const { player, keys, lasers, enemies, particles } = state;

      // 1. Controls
      if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(20, player.x - player.speed);
      if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(canvas.width - player.width - 20, player.x + player.speed);

      // Shooting
      if ((keys['Space'] || keys['ArrowUp']) && Date.now() - state.lastShot > 220) {
        lasers.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 14,
          vy: -9,
          color: '#06b6d4',
        });
        state.lastShot = Date.now();
      }

      // 2. Clear canvas
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background stars
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect((i * 37 + (Date.now() / 50)) % canvas.width, (i * 29) % canvas.height, 2, 2);
      }

      // 3. Update & Draw Lasers
      ctx.shadowBlur = 10;
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.y += l.vy;
        ctx.fillStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.fillRect(l.x, l.y, l.width, l.height);

        if (l.y < -20) {
          lasers.splice(i, 1);
          continue;
        }

        // Collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (
            l.x < e.x + e.width &&
            l.x + l.width > e.x &&
            l.y < e.y + e.height &&
            l.y + l.height > e.y
          ) {
            e.hp--;
            lasers.splice(i, 1);

            // Spawn hit sparks
            for (let p = 0; p < 8; p++) {
              particles.push({
                x: e.x + e.width / 2,
                y: e.y + e.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: e.color,
              });
            }

            if (e.hp <= 0) {
              state.score += e.points;
              setScore(state.score);
              enemies.splice(j, 1);
            }
            break;
          }
        }
      }

      // 4. Update & Draw Enemies
      let changeDir = false;
      enemies.forEach((e) => {
        e.x += e.vx;
        if (e.x + e.width > canvas.width - 20 || e.x < 20) {
          changeDir = true;
        }
      });

      if (changeDir) {
        enemies.forEach((e) => {
          e.vx = -e.vx * 1.05;
          e.y += 18;
          if (e.y + e.height >= player.y) {
            // Breach
            state.lives--;
            setLives(state.lives);
            if (state.lives <= 0) {
              handleGameOver();
            }
          }
        });
      }

      enemies.forEach((e) => {
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        // Sci-fi ship shape
        ctx.beginPath();
        ctx.moveTo(e.x + e.width / 2, e.y + e.height);
        ctx.lineTo(e.x + e.width, e.y);
        ctx.lineTo(e.x + e.width * 0.7, e.y + 6);
        ctx.lineTo(e.x + e.width * 0.3, e.y + 6);
        ctx.lineTo(e.x, e.y);
        ctx.closePath();
        ctx.fill();
      });

      // Check wave clear
      if (enemies.length === 0) {
        state.wave += 1;
        state.score += 500; // Wave bonus
        setWave(state.wave);
        setScore(state.score);
        spawnEnemies(state.wave);
      }

      // 5. Draw Player
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(player.x + player.width * 0.6, player.y + player.height * 0.8);
      ctx.lineTo(player.x + player.width * 0.4, player.y + player.height * 0.8);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // Thruster flame
      ctx.fillStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(player.x + player.width * 0.35, player.y + player.height);
      ctx.lineTo(player.x + player.width * 0.5, player.y + player.height + 8 + Math.random() * 6);
      ctx.lineTo(player.x + player.width * 0.65, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      // 6. Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) particles.splice(i, 1);
      }

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(loop);
    };

    const handleGameOver = () => {
      const finalScore = stateRef.current.score;
      const duration = Math.round((Date.now() - stateRef.current.startTime) / 1000);
      setGameState('gameover');
      if (finalScore > highScore) setHighScore(finalScore);
      if (onScoreSubmit) {
        onScoreSubmit({
          gameId: game._id,
          score: finalScore,
          duration,
          completed: false,
          extraStats: { wave: stateRef.current.wave },
        });
      }
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [gameState, game, highScore, onScoreSubmit]);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-gaming-purple/40 bg-gaming-dark/95 p-4 shadow-2xl overflow-hidden">
      {/* Game HUD */}
      <div className="flex w-full items-center justify-between px-4 py-2 border-b border-white/10 text-sm font-semibold mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gaming-cyan font-orbitron">
            <Zap className="h-4 w-4" />
            <span>SCORE: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gaming-purple font-orbitron">
            <Trophy className="h-4 w-4" />
            <span>WAVE: {wave}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gaming-pink">
            <Shield className="h-4 w-4" />
            <span>LIVES: {'❤️'.repeat(Math.max(0, lives))}</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Frame */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="rounded-xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)] max-w-full"
        />

        {/* Start Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl p-6 text-center">
            <h2 className="text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple via-gaming-cyan to-gaming-pink mb-3">
              PLANETARY BATTLE ROYALE
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Command your starfighter against hostile cosmic squadrons. Dodge alien fire, breach enemy lines, and claim the high score!
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-300 mb-6 flex gap-6">
              <span>⬅️ ➡️ / A D: Move</span>
              <span>SPACE / ⬆️: Shoot Laser</span>
            </div>
            <Button size="lg" onClick={startGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron px-8 text-base">
              <Play className="h-5 w-5 mr-2" />
              LAUNCH MISSION
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-xl p-6 text-center animate-in fade-in">
            <h2 className="text-4xl font-black font-orbitron text-destructive mb-2">
              HULL BREACHED!
            </h2>
            <p className="text-muted-foreground text-sm mb-4">Your starfighter was destroyed in action.</p>
            <div className="bg-gaming-card/90 border border-gaming-purple/40 rounded-xl p-4 w-64 mb-6 shadow-xl">
              <div className="text-xs text-muted-foreground">FINAL SCORE</div>
              <div className="text-3xl font-black text-gaming-cyan font-orbitron my-1">{score}</div>
              <div className="text-xs text-gaming-purple">Waves Survived: {wave - 1}</div>
            </div>
            <Button size="lg" onClick={startGame} className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron">
              <RotateCcw className="h-5 w-5 mr-2" />
              REDEPLOY FLEET
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-3 flex items-center gap-4">
        <span>Controls: Arrow Keys / WASD + Spacebar</span>
        <span>•</span>
        <span>Auto-submits score to Global Leaderboard</span>
      </div>
    </div>
  );
}

export default SpaceInvadersGame;
