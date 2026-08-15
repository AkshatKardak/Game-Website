import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Trophy, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpaceInvadersGame } from './playable/SpaceInvadersGame';
import { CelestialDriftGame } from './playable/CelestialDriftGame';
import { Cyber2048Game } from './playable/Cyber2048Game';
import { NeonSnakeGame } from './playable/NeonSnakeGame';
import { StellarStrikeGame } from './playable/StellarStrikeGame';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import scoreService from '@/services/scoreService';

export function GamePlayer() {
  const { activeGameToPlay, closeGamePlayer } = useGame();
  const { user, isAuthenticated, addXP } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSubmissionNotice, setLastSubmissionNotice] = useState(null);

  if (!activeGameToPlay) return null;

  const handleScoreSubmit = async (scoreData) => {
    if (!isAuthenticated) {
      setLastSubmissionNotice({
        message: `Awesome score: ${scoreData.score.toLocaleString()}! Log in to save to Global Leaderboards & earn XP.`,
        type: 'info',
      });
      return;
    }

    try {
      const data = await scoreService.submitScore(scoreData);
      addXP(data.earnedXP, data.newLevel, data.leveledUp, data.newAchievements);

      setLastSubmissionNotice({
        message: `+${data.earnedXP} XP Earned! ${data.leveledUp ? '🎉 LEVEL UP!' : ''} ${
          data.newAchievements?.length ? '🏆 Achievement Unlocked!' : ''
        } (Global Rank #${data.rank})`,
        type: 'success',
      });

      setTimeout(() => setLastSubmissionNotice(null), 6000);
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  };

  const renderGameEngine = () => {
    const type = activeGameToPlay.playableType || 'space-invaders';
    switch (type) {
      case 'celestial-drift':
        return <CelestialDriftGame game={activeGameToPlay} onScoreSubmit={handleScoreSubmit} />;
      case 'cyber-2048':
        return <Cyber2048Game game={activeGameToPlay} onScoreSubmit={handleScoreSubmit} />;
      case 'neon-snake':
        return <NeonSnakeGame game={activeGameToPlay} onScoreSubmit={handleScoreSubmit} />;
      case 'stellar-strike':
        return <StellarStrikeGame game={activeGameToPlay} onScoreSubmit={handleScoreSubmit} />;
      case 'space-invaders':
      default:
        return <SpaceInvadersGame game={activeGameToPlay} onScoreSubmit={handleScoreSubmit} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          onClick={closeGamePlayer}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: 'spring' }}
          className={`relative z-50 flex flex-col rounded-3xl border-2 border-gaming-purple/40 bg-gaming-darker/95 p-4 shadow-[0_0_80px_rgba(139,92,246,0.3)] backdrop-blur-2xl overflow-hidden ${
            isFullscreen ? 'w-[98vw] h-[96vh]' : 'w-full max-w-4xl max-h-[92vh]'
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gaming-purple/20 text-gaming-purple border border-gaming-purple/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-lg text-white tracking-wide">
                  {activeGameToPlay.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] h-4">
                    {activeGameToPlay.genre}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Difficulty: {activeGameToPlay.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-400 hover:text-white rounded-full"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeGamePlayer}
                className="text-gray-400 hover:text-rose-400 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Alert Notification for Score Submissions / XP */}
          {lastSubmissionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 rounded-xl bg-gradient-to-r from-gaming-purple/30 via-gaming-cyan/20 to-gaming-purple/30 border border-gaming-purple/50 text-xs font-bold text-white text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{lastSubmissionNotice.message}</span>
            </motion.div>
          )}

          {/* Interactive Game Canvas Engine */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-1">
            {renderGameEngine()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default GamePlayer;
