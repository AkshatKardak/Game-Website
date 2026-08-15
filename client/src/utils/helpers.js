// Helper functions for gaming stats, formatting, and levels

export function formatNumber(num) {
  if (!num && num !== 0) return '0';
  return Number(num).toLocaleString();
}

export function formatScore(score) {
  return formatNumber(score);
}

export function formatDuration(seconds) {
  if (!seconds) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function getLevelProgress(xp, level) {
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
  const nextLevelBaseXP = Math.pow(level, 2) * 100;
  const xpNeeded = nextLevelBaseXP - currentLevelBaseXP;
  const xpIntoCurrentLevel = Math.max(0, xp - currentLevelBaseXP);
  const percent = Math.min(100, Math.round((xpIntoCurrentLevel / (xpNeeded || 100)) * 100));
  return {
    percent,
    current: xpIntoCurrentLevel,
    needed: xpNeeded,
  };
}

export function getRarityColor(rarity) {
  switch (rarity) {
    case 'legendary':
      return { text: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/50', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]' };
    case 'epic':
      return { text: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400/50', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.5)]' };
    case 'rare':
      return { text: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/50', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.5)]' };
    default:
      return { text: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-500/50', glow: 'shadow-none' };
  }
}
