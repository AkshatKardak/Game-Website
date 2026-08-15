import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Gamepad2, Heart, Users, Sparkles, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';

export function GameCard({ game }) {
  const { playGame, toggleFavorite } = useGame();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const isFavorite = user?.favorites?.some(
    (fav) => (typeof fav === 'string' ? fav : fav._id) === game._id
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    toggleFavorite(game._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full flex flex-col justify-between overflow-hidden border-2 border-white/10 hover:border-gaming-purple transition-all duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.35)] bg-gaming-card/90 backdrop-blur-md rounded-2xl">
        {/* Cover Image & Badges */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={game.image || '/images/hero-banner.png'}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/images/hero-banner.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-card via-transparent to-black/30" />

          {/* Genre Badge */}
          <Badge className="absolute top-3 left-3 bg-gaming-purple/90 backdrop-blur-md text-white font-orbitron text-[11px] shadow-lg">
            {game.genre}
          </Badge>

          {/* Favorite Toggle */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-rose-500/80 border-rose-400 text-white scale-110 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-black/50 border-white/20 text-gray-300 hover:text-white hover:bg-black/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Play Hover Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <Button
              onClick={() => playGame(game)}
              size="sm"
              className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron shadow-[0_0_20px_rgba(139,92,246,0.8)] scale-90 group-hover:scale-100 transition-transform"
            >
              <Play className="w-4 h-4 mr-1.5 fill-current" />
              PLAY NOW
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-orbitron font-bold text-lg text-white group-hover:text-gaming-purple transition-colors truncate">
                {game.title}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
              {game.description}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{game.rating || 4.8}</span>
                <span className="text-muted-foreground font-normal">({game.totalRatings || 0})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Gamepad2 className="w-3.5 h-3.5 text-gaming-cyan" />
                <span>{game.plays || 0} plays</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => playGame(game)}
                size="sm"
                className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron text-xs shadow-md"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Launch
              </Button>
              <Link to={`/games/${game._id || game.slug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 hover:bg-white/5 font-orbitron text-xs"
                >
                  Overview
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default GameCard;
