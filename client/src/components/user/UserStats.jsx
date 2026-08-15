import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Gamepad2, Flame, Award, Clock, Star } from 'lucide-react';
import { formatNumber, formatDuration } from '@/utils/helpers';

export function UserStats({ stats }) {
  if (!stats) return null;

  const statItems = [
    {
      label: 'GAMES PLAYED',
      value: formatNumber(stats.gamesPlayed),
      icon: <Gamepad2 className="w-5 h-5 text-gaming-purple" />,
      color: 'from-gaming-purple/20',
    },
    {
      label: 'TOTAL HIGH SCORE',
      value: formatNumber(stats.totalScore),
      icon: <Star className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20',
    },
    {
      label: 'DAILY LOGIN STREAK',
      value: `${stats.streak || 1} Days`,
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      color: 'from-rose-500/20',
    },
    {
      label: 'ACHIEVEMENTS EARNED',
      value: `${stats.achievementsCount || 0}`,
      icon: <Award className="w-5 h-5 text-gaming-cyan" />,
      color: 'from-cyan-500/20',
    },
    {
      label: 'TOTAL COMBAT PLAYTIME',
      value: formatDuration(stats.totalPlaytimeSeconds || 0),
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-500/20',
    },
    {
      label: 'PILOT RANK TIER',
      value: stats.level >= 10 ? 'Apex Sovereign' : stats.level >= 5 ? 'Commander' : 'Recruit',
      icon: <Trophy className="w-5 h-5 text-gaming-pink" />,
      color: 'from-pink-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className={`border border-white/10 bg-gradient-to-br ${item.color} to-gaming-card/80 backdrop-blur-md rounded-2xl p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-orbitron font-semibold text-muted-foreground uppercase">
              {item.label}
            </span>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
              {item.icon}
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-orbitron text-white">
            {item.value}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default UserStats;
