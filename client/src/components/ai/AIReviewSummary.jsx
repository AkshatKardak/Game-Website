import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, TrendingUp, Sparkles, Star } from 'lucide-react';
import aiService from '@/services/aiService';

export function AIReviewSummary({ gameId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await aiService.getReviewSummary(gameId);
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Failed to fetch AI review summary:', error);
      } finally {
        setLoading(false);
      }
    }
    if (gameId) fetchSummary();
  }, [gameId]);

  if (loading) {
    return (
      <Card className="border-2 border-gaming-purple/20 bg-gaming-dark/70 p-6">
        <Skeleton className="h-20 w-full mb-4 rounded-xl" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="border-2 border-gaming-purple/30 bg-gradient-to-br from-gaming-dark/95 via-gaming-card/90 to-gaming-purple/10 backdrop-blur-xl p-6 shadow-2xl">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-gaming-purple/20 text-gaming-purple border border-gaming-purple/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-lg text-white">AI Community Sentiment & Synthesis</h3>
          <p className="text-xs text-muted-foreground">Synthesized across recent player battle logs</p>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-gray-300 leading-relaxed mb-6 bg-white/5 p-4 rounded-xl border border-white/10"
      >
        {summary.overallSummary}
      </motion.p>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="p-3 bg-black/40 rounded-xl border border-white/10">
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-orbitron flex items-center justify-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{summary.averageRating}</span>
          </div>
          <div className="text-[11px] text-muted-foreground uppercase mt-1">Avg Score</div>
        </div>

        <div className="p-3 bg-black/40 rounded-xl border border-white/10">
          <div className="text-xl sm:text-2xl font-black text-gaming-cyan font-orbitron">
            {summary.recommendationRate}%
          </div>
          <div className="text-[11px] text-muted-foreground uppercase mt-1">Recommended</div>
        </div>

        <div className="p-3 bg-black/40 rounded-xl border border-white/10">
          <Badge variant="accent" className="text-xs font-orbitron uppercase">
            {summary.sentiment || 'Positive'}
          </Badge>
          <div className="text-[11px] text-muted-foreground uppercase mt-1">Tone Analysis</div>
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <h4 className="font-orbitron text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            WHAT PILOTS PRAISE
          </h4>
          <ul className="space-y-2">
            {summary.pros?.map((pro, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <h4 className="font-orbitron text-xs font-bold text-rose-400 mb-3 flex items-center gap-1.5">
            <ThumbsDown className="w-3.5 h-3.5" />
            KEY CHALLENGES / CRITIQUES
          </h4>
          <ul className="space-y-2">
            {summary.cons?.map((con, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default AIReviewSummary;
