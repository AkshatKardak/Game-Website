import React from 'react';
import { Gamepad2, Award, Clock, Star, Zap } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';

export function ActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl border border-white/5 bg-black/20">
        No recent combat log activities found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((act, index) => (
        <div
          key={act.id || index}
          className="flex items-center justify-between p-4 rounded-2xl bg-gaming-card/60 border border-white/5 hover:border-gaming-purple/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gaming-purple/10 text-gaming-purple border border-gaming-purple/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-orbitron">{act.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(act.timestamp).toLocaleDateString()} at{' '}
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="font-orbitron font-black text-sm text-gaming-cyan">
              +{formatNumber(act.score)} PTS
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
