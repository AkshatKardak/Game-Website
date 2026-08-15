import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Sparkles, Shield, Flame, Play, ChevronRight, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FloatingOrb } from '@/components/animations/FloatingOrb';
import { AnimatedText } from '@/components/animations/AnimatedText';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TiltCard } from '@/components/animations/TiltCard';
import { AIRecommendations } from '@/components/ai/AIRecommendations';
import { GameCard } from '@/components/games/GameCard';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import gameService from '@/services/gameService';

export function Home() {
  const { playGame } = useGame();
  const { openAuthModal, isAuthenticated } = useAuth();
  const [trendingGames, setTrendingGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);

  useEffect(() => {
    gameService.getTrendingGames().then((data) => setTrendingGames(data.games || []));
    gameService.getFeaturedGames().then((data) => setFeaturedGames(data.games || []));
  }, []);

  const eliteTeams = [
    {
      name: 'Game Over',
      desc: 'Masters of planetary strategy and precision fleet operations.',
      logo: '/images/team-logo-1.png',
      specialty: 'Tactical RTS & Strategy',
      color: 'border-purple-500/40 text-purple-400',
    },
    {
      name: 'Reaper Squad',
      desc: 'Silent assassins and lightning zero-g combat specialists.',
      logo: '/images/team-logo-2.png',
      specialty: 'Speedrunning & Stealth',
      color: 'border-pink-500/40 text-pink-400',
    },
    {
      name: 'Martial Master',
      desc: 'Combat experts with unmatched zero-gravity arena mechanics.',
      logo: '/images/team-logo-3.png',
      specialty: 'Melee & Defense',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      name: 'Phoenix Team',
      desc: 'Rising from defeat to claim eternal leaderboard supremacy.',
      logo: '/images/team-logo-4.png',
      specialty: 'High-Score Vanguards',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      name: 'Grim Sniper',
      desc: 'Precision marksmen with deadly laser accuracy across the stars.',
      logo: '/images/team-logo-5.png',
      specialty: 'Orbital Precision',
      color: 'border-blue-500/40 text-blue-400',
    },
    {
      name: 'The Killers',
      desc: 'Elite vanguard feared across all planetary battlegrounds.',
      logo: '/images/team-logo-6.png',
      specialty: 'Apex Champion Guild',
      color: 'border-rose-500/40 text-rose-400',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section with Floating Orbs & 3D Tilt */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12">
        {/* Glowing Background Orbs */}
        <FloatingOrb color="#8b5cf6" size={450} className="-top-10 -left-20" delay={0} />
        <FloatingOrb color="#3b82f6" size={500} className="bottom-0 -right-20" delay={2} />
        <FloatingOrb color="#ec4899" size={350} className="top-1/3 right-1/4" delay={4} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gaming-purple/15 border border-gaming-purple/40 text-gaming-purple mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gaming-cyan" />
              <span className="text-xs font-orbitron font-bold tracking-widest uppercase">
                GALACTIC SQUAD V2.0 • AI-POWERED ARCADE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-orbitron leading-tight tracking-tight mb-6 text-white">
              LEVEL UP YOUR <br />
              <AnimatedText text="GAMING SUPREMACY" />
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Discover, play, and compete in the ultimate full-stack destination. Play browser arcade games, unlock achievements, earn XP, and dominate global leaderboards with Groq AI assistance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/games">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-pink hover:opacity-95 text-white font-orbitron text-sm px-8 h-14 shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  EXPLORE ALL GAMES
                </Button>
              </Link>

              <Link to="/leaderboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white font-orbitron text-sm px-8 h-14 backdrop-blur-md"
                >
                  <Trophy className="w-5 h-5 mr-2 text-amber-400" />
                  GLOBAL LEADERBOARDS
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Hero Banner Game Showcase */}
      {featuredGames.length > 0 && (
        <section className="container mx-auto px-4">
          <ScrollReveal>
            <TiltCard>
              <div className="relative rounded-3xl overflow-hidden border-2 border-gaming-purple/50 bg-gaming-card/90 shadow-[0_0_60px_rgba(139,92,246,0.25)] p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl space-y-4">
                  <Badge variant="accent" className="font-orbitron text-xs">
                    FEATURED COMBAT ARENA
                  </Badge>
                  <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white">
                    {featuredGames[0].title}
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {featuredGames[0].description}
                  </p>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold font-orbitron">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span>{featuredGames[0].rating} / 5.0</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {featuredGames[0].plays || 340}+ Battles Fought
                    </div>
                  </div>
                  <div className="pt-4 flex gap-4">
                    <Button
                      size="lg"
                      onClick={() => playGame(featuredGames[0])}
                      className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron text-xs px-8"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      PLAY NOW
                    </Button>
                    <Link to={`/games/${featuredGames[0]._id}`}>
                      <Button variant="outline" size="lg" className="font-orbitron text-xs">
                        Game Specs
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="w-full md:w-1/2 max-w-md relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src={featuredGames[0].image}
                    alt={featuredGames[0].title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero-banner.png';
                    }}
                  />
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </section>
      )}

      {/* Groq AI Recommendations Component */}
      <section className="container mx-auto px-4">
        <AIRecommendations />
      </section>

      {/* Trending Games Section */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white flex items-center gap-3">
              <Flame className="w-7 h-7 text-rose-500 fill-rose-500" />
              TRENDING SQUAD ARENAS
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Most active games with high score competition this week
            </p>
          </div>
          <Link to="/games">
            <Button variant="ghost" className="text-gaming-purple hover:text-white font-orbitron text-xs">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingGames.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      </section>

      {/* Elite Squads Showcase (Preserving Original Site Lore & Assets) */}
      <section id="teams" className="container mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="font-orbitron text-xs text-gaming-cyan border-gaming-cyan/40 mb-3">
            GALACTIC FACTIONS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-orbitron text-white mb-3">
            OUR ELITE GUILDS
          </h2>
          <p className="text-sm text-muted-foreground">
            Legendary squads dominating galactic leaderboards and competing across high-stakes tournaments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eliteTeams.map((team, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full border-2 border-white/10 hover:border-gaming-purple/60 bg-gaming-card/80 backdrop-blur-md p-6 flex flex-col justify-between rounded-2xl shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 rounded-2xl bg-black/40 border border-white/10 shrink-0">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/images/team-logo-1.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-base text-white">{team.name}</h3>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      {team.specialty}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {team.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Call to Action Banner */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden border-2 border-gaming-purple/40 bg-gradient-to-r from-gaming-purple/30 via-gaming-card to-gaming-cyan/20 p-8 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-5xl font-black font-orbitron text-white mb-4">
            READY TO JOIN THE ELITE SQUAD?
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-8">
            Create your commander profile in seconds. Unlock exclusive achievement badges, save high scores, and ascend the cosmic rankings.
          </p>
          <div className="flex justify-center gap-4">
            {!isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => openAuthModal('signup')}
                className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron px-8 h-12 text-sm shadow-[0_0_30px_rgba(139,92,246,0.6)]"
              >
                ENLIST NOW (+50 XP)
              </Button>
            ) : (
              <Link to="/games">
                <Button size="lg" className="bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron px-8 h-12 text-sm">
                  ENTER BATTLE ARENA
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
