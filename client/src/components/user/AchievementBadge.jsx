import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Star, Crown, Flame, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRarityColor } from '@/utils/helpers';

export function AchievementBadge({ achievement, unlocked = false }) {
  const rarityColors = getRarityColor(achievement.rarity || 'common');

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'crown':
        return <Crown className="w-6 h-6" />;
      case 'flame':
        return <Flame className="w-6 h-6" />;
      case 'shield':
        return <Shield className="w-6 h-6" />;
      case 'trophy':
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative p-4 rounded-2xl border transition-all duration-300 ${
        unlocked
          ? `bg-gaming-card/90 ${rarityColors.border} ${rarityColors.glow}`
          : 'bg-black/40 border-white/5 opacity-50 grayscale'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-3 rounded-xl border ${
            unlocked
              ? `${rarityColors.bg} ${rarityColors.text} ${rarityColors.border}`
              : 'bg-white/5 text-gray-500 border-white/10'
          }`}
        >
          {unlocked ? getIcon(achievement.icon) : <Lock className="w-6 h-6" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-orbitron font-bold text-sm text-white truncate">
              {achievement.title}
            </h4>
            <Badge
              variant="outline"
              className={`text-[9px] uppercase font-orbitron ${rarityColors.text} border-current`}
            >
              {achievement.rarity || 'common'}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            {achievement.description}
          </p>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gaming-cyan font-semibold">+{achievement.xpReward || 100} XP</span>
            <span className="text-muted-foreground text-[10px]">
              {unlocked ? '✅ Unlocked' : '🔒 Locked'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AchievementBadge;
