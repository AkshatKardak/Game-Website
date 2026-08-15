import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gamepad2, TrendingUp, Star } from 'lucide-react';
import aiService from '@/services/aiService';
import { useGame } from '@/context/GameContext';
import { Link } from 'react-router-dom';

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { playGame, games } = useGame();

  const fetchRecommendations = async () => {
    try {
      const data = await aiService.getRecommendations(3);
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 my-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="my-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="p-2 rounded-xl bg-gaming-purple/20 border border-gaming-purple/40 text-gaming-purple"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold font-orbitron text-white">AI Tactical Recommendations</h2>
            <p className="text-xs text-muted-foreground">Neural inference powered by Groq Llama 3.3</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto border-gaming-purple/30 hover:bg-gaming-purple/20"
        >
          <TrendingUp className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Analyzing...' : 'Recalibrate AI'}
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <AnimatePresence>
          {recommendations.map((rec, index) => {
            const matchedGame = games.find((g) => g._id === rec.gameId || g.title === rec.title);
            return (
              <motion.div
                key={rec.gameId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="group h-full flex flex-col justify-between overflow-hidden border-2 border-white/10 hover:border-gaming-purple transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] bg-gaming-card/90 backdrop-blur-md">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={rec.image || matchedGame?.image || '/images/hero-banner.png'}
                      alt={rec.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero-banner.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-transparent to-transparent" />
                    
                    <Badge variant="accent" className="absolute top-3 right-3 font-orbitron bg-cyan-950/80 backdrop-blur-md border-cyan-400">
                      {rec.matchScore || 96}% MATCH
                    </Badge>

                    <Badge variant="default" className="absolute top-3 left-3 font-semibold bg-gaming-purple/80 backdrop-blur-md">
                      {rec.genre || 'Sci-Fi Action'}
                    </Badge>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg font-orbitron text-white group-hover:text-gaming-purple transition-colors">
                          {rec.title}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rec.rating || 4.9}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {rec.reason}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      {matchedGame ? (
                        <Button
                          onClick={() => playGame(matchedGame)}
                          size="sm"
                          className="flex-1 bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron text-xs"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 mr-1.5" />
                          Play Now
                        </Button>
                      ) : null}
                      <Link
                        to={matchedGame ? `/games/${matchedGame._id}` : '/games'}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-white/20 hover:bg-white/5 text-xs font-orbitron"
                        >
                          Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AIRecommendations;
