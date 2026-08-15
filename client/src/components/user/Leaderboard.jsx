import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, Flame, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/utils/helpers';

export function Leaderboard({ entries = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3 my-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-white/10 bg-gaming-card/40 my-6">
        <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <h3 className="font-orbitron font-bold text-lg text-white mb-1">No battle scores recorded</h3>
        <p className="text-xs text-muted-foreground">Be the first squad pilot to claim the top leaderboard ranking!</p>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <Crown className="w-5 h-5 fill-current" />
          </div>
        );
      case 2:
        return (
          <div className="p-2 rounded-xl bg-slate-300/20 text-slate-200 border border-slate-300/40">
            <Medal className="w-5 h-5 fill-current" />
          </div>
        );
      case 3:
        return (
          <div className="p-2 rounded-xl bg-amber-700/20 text-amber-500 border border-amber-700/40">
            <Medal className="w-5 h-5 fill-current" />
          </div>
        );
      default:
        return (
          <span className="font-orbitron font-bold text-base text-gray-400 w-8 text-center">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 my-6">
      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
        {topThree.map((item, idx) => {
          const isGold = item.rank === 1;
          return (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl p-6 border text-center transition-all ${
                isGold
                  ? 'bg-gradient-to-b from-amber-500/20 via-gaming-card to-black/80 border-amber-400/60 shadow-[0_0_40px_rgba(251,191,36,0.25)] md:-translate-y-4'
                  : 'bg-gaming-card/90 border-white/10'
              }`}
            >
              <div className="absolute top-4 right-4">{getRankBadge(item.rank)}</div>

              <div className="flex flex-col items-center mb-3">
                <Avatar className={`w-20 h-20 border-2 mb-2 ${isGold ? 'border-amber-400' : 'border-gaming-purple'}`}>
                  <AvatarImage src={item.avatar} />
                  <AvatarFallback>{item.username?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h4 className="font-orbitron font-bold text-base text-white">{item.username}</h4>
                <Badge variant="default" className="text-[10px] mt-1 font-orbitron bg-gaming-purple">
                  LEVEL {item.level || 1}
                </Badge>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-muted-foreground uppercase font-orbitron">HIGH SCORE</div>
                <div className={`text-2xl font-black font-orbitron ${isGold ? 'text-amber-400' : 'text-gaming-cyan'}`}>
                  {formatNumber(item.highScore)}
                </div>
                {item.gameTitle && (
                  <div className="text-[11px] text-muted-foreground mt-1 truncate">{item.gameTitle}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl border border-white/10 bg-gaming-dark/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-black/40 text-xs font-orbitron text-muted-foreground uppercase">
              <tr>
                <th className="p-4 pl-6">Rank</th>
                <th className="p-4">Pilot</th>
                <th className="p-4">Level</th>
                <th className="p-4">Arena</th>
                <th className="p-4 pr-6 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="hover:bg-white/5 transition-colors font-medium"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2">{getRankBadge(row.rank)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-white/10">
                        <AvatarImage src={row.avatar} />
                        <AvatarFallback>{row.username?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-white font-orbitron">{row.username}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-xs font-orbitron border-gaming-purple/40 text-gaming-purple">
                      LVL {row.level || 1}
                    </Badge>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {row.gameTitle || 'Universal'}
                  </td>
                  <td className="p-4 pr-6 text-right font-orbitron font-black text-gaming-cyan text-base">
                    {formatNumber(row.highScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
