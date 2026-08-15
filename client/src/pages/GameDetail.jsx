import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Star,
  Play,
  Heart,
  Calendar,
  Layers,
  Award,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AIGameCoach } from '@/components/ai/AIGameCoach';
import { AIReviewSummary } from '@/components/ai/AIReviewSummary';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import gameService from '@/services/gameService';
import api from '@/services/api';

export function GameDetail() {
  const { id } = useParams();
  const { playGame, toggleFavorite } = useGame();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const fetchGameData = async () => {
    setLoading(true);
    try {
      const data = await gameService.getGame(id);
      setGame(data.game);
      setReviews(data.game?.reviews || []);
    } catch (err) {
      console.error('Failed to fetch game details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    setReviewMessage('');

    try {
      const res = await api.post('/reviews', {
        gameId: game._id,
        rating: newRating,
        title: newTitle || 'Great Battle Experience',
        comment: newComment,
      });

      setReviews([res.data.review, ...reviews]);
      setNewComment('');
      setNewTitle('');
      setReviewMessage('✅ Battle review posted successfully (+40 XP)!');
      setTimeout(() => setReviewMessage(''), 5000);
    } catch (err) {
      setReviewMessage(`⚠️ ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await api.post(`/reviews/${reviewId}/like`);
      setReviews(
        reviews.map((r) =>
          r._id === reviewId
            ? { ...r, likes: Array(res.data.likesCount).fill('user_liked') }
            : r
        )
      );
    } catch (err) {
      console.error('Failed to like review:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl md:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Game Not Found</h2>
        <Link to="/games">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isFavorite = user?.favorites?.some(
    (fav) => (typeof fav === 'string' ? fav : fav._id) === game._id
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 min-h-[85vh]">
      {/* Back Link */}
      <Link
        to="/games"
        className="inline-flex items-center text-xs text-muted-foreground hover:text-white font-orbitron transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 text-gaming-purple" />
        BACK TO GAMES REPOSITORY
      </Link>

      {/* Hero Banner Showcase */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-gaming-purple/40 bg-gaming-card/90 shadow-2xl">
        <div className="relative h-80 sm:h-96 w-full overflow-hidden">
          <img
            src={game.image || '/images/hero-banner.png'}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/hero-banner.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-darker via-gaming-dark/60 to-transparent" />

          {/* Floating Actions Over Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-gaming-purple text-white font-orbitron">{game.genre}</Badge>
                <Badge variant="accent" className="font-orbitron">
                  {game.difficulty?.toUpperCase()} TIER
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-orbitron text-white">
                {game.title}
              </h1>
              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                onClick={() => playGame(game)}
                className="bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-pink hover:opacity-90 font-orbitron text-sm px-8 h-14 shadow-[0_0_30px_rgba(139,92,246,0.6)] text-white"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                PLAY NOW
              </Button>

              <button
                onClick={() => {
                  if (!isAuthenticated) openAuthModal('login');
                  else toggleFavorite(game._id);
                }}
                className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                  isFavorite
                    ? 'bg-rose-500/30 border-rose-500 text-rose-400'
                    : 'bg-black/60 border-white/20 text-gray-300 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left Details, Right AI Coach & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Game Description & Features */}
          <Card className="border border-white/10 bg-gaming-card/80 backdrop-blur-md p-6 rounded-2xl">
            <h3 className="font-orbitron font-bold text-lg text-white mb-4">TACTICAL BRIEFING</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
              {game.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1">DEVELOPER</span>
                <span className="font-semibold text-white">{game.developer || 'Galactic Squad Studios'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">RELEASE ERA</span>
                <span className="font-semibold text-white">2026 Season</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">PLAY ENGINE</span>
                <span className="font-semibold text-gaming-cyan font-orbitron">HTML5 / Canvas 60FPS</span>
              </div>
            </div>
          </Card>

          {/* AI Community Sentiment & Review Summarizer */}
          <AIReviewSummary gameId={game._id} />

          {/* Community Reviews Section */}
          <Card className="border border-white/10 bg-gaming-card/80 backdrop-blur-md p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gaming-purple" />
                PILOT BATTLE LOGS ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-amber-400 font-bold font-orbitron text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{game.rating} / 5.0</span>
              </div>
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 p-4 rounded-2xl bg-black/40 border border-white/10">
              <h4 className="font-orbitron text-xs font-bold text-gaming-cyan uppercase">
                SUBMIT PILOT REVIEW (+40 XP)
              </h4>

              {reviewMessage && (
                <div className="p-3 rounded-xl bg-gaming-purple/20 border border-gaming-purple/40 text-xs text-white">
                  {reviewMessage}
                </div>
              )}

              {/* Star Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Review Headline (e.g. Masterpiece arcade action!)"
                className="text-xs bg-black/60"
              />

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your battle feedback, gameplay strategies, and thoughts..."
                rows={3}
                required
                className="w-full rounded-xl bg-black/60 border border-white/15 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-gaming-purple resize-none"
              />

              <Button
                type="submit"
                disabled={submittingReview}
                size="sm"
                className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {submittingReview ? 'Transmitting...' : 'Transmit Battle Review'}
              </Button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-white/10">
                        <AvatarImage src={rev.user?.avatar} />
                        <AvatarFallback>{rev.user?.username?.slice(0, 2) || 'PL'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-orbitron font-bold text-xs text-white">
                          {rev.user?.username || 'Galactic Pilot'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Level {rev.user?.level || 1} Commander
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <h5 className="font-bold text-sm text-white pt-1">{rev.title}</h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-muted-foreground">
                    <span>{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleLikeReview(rev._id)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-gaming-purple" />
                      <span>{rev.likes?.length || 0} Pilots found helpful</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Game Coach */}
        <div className="space-y-6">
          <AIGameCoach gameId={game._id} gameTitle={game.title} />
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
