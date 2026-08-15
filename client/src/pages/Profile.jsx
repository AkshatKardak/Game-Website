import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Trophy,
  Star,
  Award,
  Zap,
  Clock,
  Heart,
  Flame,
  Gamepad2,
  Edit3,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { UserStats } from '@/components/user/UserStats';
import { AchievementBadge } from '@/components/user/AchievementBadge';
import { ActivityFeed } from '@/components/user/ActivityFeed';
import { GameCard } from '@/components/games/GameCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { getLevelProgress } from '@/utils/helpers';
import api from '@/services/api';

export function Profile() {
  const { id } = useParams();
  const { user: authUser, updateUserState } = useAuth();
  const isSelf = !id || id === 'me' || id === authUser?._id;
  const targetId = isSelf ? authUser?._id : id;

  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');

  const avatarOptions = [
    '/images/team-logo-1.png',
    '/images/team-logo-2.png',
    '/images/team-logo-3.png',
    '/images/team-logo-4.png',
    '/images/team-logo-5.png',
    '/images/team-logo-6.png',
  ];

  useEffect(() => {
    async function loadProfile() {
      if (!targetId && isSelf && !authUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [userRes, statsRes, actRes] = await Promise.all([
          api.get(`/users/${targetId || authUser?._id}`),
          api.get(`/users/${targetId || authUser?._id}/stats`),
          api.get(`/users/${targetId || authUser?._id}/activity`),
        ]);

        setProfileUser(userRes.data.user);
        setStats(statsRes.data.stats);
        setActivities(actRes.data.activities || []);
        setBioInput(userRes.data.user.bio || '');

        // Fetch mock / seed achievements list
        const defaultAchs = [
          {
            _id: 'ach-1',
            key: 'first_recruit',
            title: 'Galactic Recruit',
            description: 'Enlisted in the Galactic Squad network and created your battle profile.',
            icon: 'shield',
            xpReward: 50,
            rarity: 'common',
          },
          {
            _id: 'ach-2',
            key: 'first_blood',
            title: 'First Blood',
            description: 'Launched into battle and completed your very first game simulation.',
            icon: 'zap',
            xpReward: 100,
            rarity: 'common',
          },
          {
            _id: 'ach-3',
            key: 'score_1000',
            title: 'Centurion 1,000+',
            description: 'Surpassed 1,000 points in an arcade arena run.',
            icon: 'star',
            xpReward: 150,
            rarity: 'rare',
          },
          {
            _id: 'ach-4',
            key: 'score_5000',
            title: 'Cosmic Dominator 5,000+',
            description: 'Crushed the enemy vanguard with over 5,000 high score points.',
            icon: 'trophy',
            xpReward: 300,
            rarity: 'epic',
          },
          {
            _id: 'ach-5',
            key: 'veteran_player',
            title: 'Veteran Fleet Commander',
            description: 'Commanded 10 battle missions across galactic space.',
            icon: 'crown',
            xpReward: 250,
            rarity: 'epic',
          },
          {
            _id: 'ach-6',
            key: 'apex_sovereign',
            title: 'Apex Sovereign',
            description: 'Achieved legendary status through absolute galactic supremacy.',
            icon: 'flame',
            xpReward: 500,
            rarity: 'legendary',
          },
        ];
        setAllAchievements(defaultAchs);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [targetId, authUser]);

  const handleSaveBio = async () => {
    try {
      const res = await api.put('/users/profile', { bio: bioInput });
      setProfileUser(res.data.user);
      if (updateUserState) updateUserState(res.data.user);
      setIsEditingBio(false);
    } catch (err) {
      console.error('Failed to save bio:', err);
    }
  };

  const handleSelectAvatar = async (avatarUrl) => {
    try {
      const res = await api.put('/users/profile', { avatar: avatarUrl });
      setProfileUser(res.data.user);
      if (updateUserState) updateUserState(res.data.user);
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const currentUser = profileUser || authUser;

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Pilot Not Found</h2>
        <p className="text-sm text-muted-foreground mb-4">Please log in to view your battle statistics.</p>
        <Link to="/games">
          <Button variant="outline">Browse Games</Button>
        </Link>
      </div>
    );
  }

  const levelInfo = getLevelProgress(currentUser.xp || 0, currentUser.level || 1);
  const unlockedAchievementIds = new Set(
    (currentUser.achievements || []).map((a) => (typeof a === 'string' ? a : a._id || a.key))
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-10 min-h-[85vh]">
      {/* Profile Header Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-gaming-purple/40 bg-gradient-to-r from-gaming-purple/20 via-gaming-card/90 to-gaming-cyan/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with glowing ring */}
          <div className="relative group">
            <Avatar className="w-28 h-28 border-4 border-gaming-purple shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-2xl">{currentUser.username?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Badge className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gaming-purple text-white font-orbitron text-xs shadow-lg">
              LVL {currentUser.level || 1}
            </Badge>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black font-orbitron text-white">
                  {currentUser.username}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <Badge variant="secondary" className="font-orbitron text-[10px]">
                    {currentUser.role === 'admin' ? '🛡️ SUPREME FLEET COMMANDER' : '🚀 SQUAD WARRIOR'}
                  </Badge>
                  <span className="text-xs text-amber-400 font-bold">
                    🔥 {currentUser.streak || 1} Day Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {isEditingBio ? (
              <div className="flex gap-2 max-w-lg">
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={150}
                  className="flex-1 rounded-xl bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white"
                />
                <Button size="sm" onClick={handleSaveBio} className="bg-gaming-purple text-xs">
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-300 italic max-w-xl">
                  "{currentUser.bio || 'Galactic squad explorer ready for battle.'}"
                </p>
                {isSelf && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="text-muted-foreground hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* XP Progress Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-muted-foreground mb-1 font-orbitron">
                <span>PROGRESS TO LEVEL {(currentUser.level || 1) + 1}</span>
                <span className="text-gaming-cyan font-bold">{levelInfo.percent}%</span>
              </div>
              <Progress value={levelInfo.percent} className="h-2.5 bg-black/60" />
            </div>
          </div>
        </div>

        {/* Avatar Chooser for Own Profile */}
        {isSelf && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-orbitron font-semibold text-muted-foreground">
              GUILD EMBLEM:
            </span>
            <div className="flex gap-2">
              {avatarOptions.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAvatar(av)}
                  className={`p-1 rounded-xl border transition-all ${
                    currentUser.avatar === av
                      ? 'border-gaming-purple bg-gaming-purple/30 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.6)]'
                      : 'border-white/10 hover:border-white/30 bg-black/40'
                  }`}
                >
                  <img src={av} alt="Emblem" className="w-7 h-7 object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary Grid */}
      <UserStats stats={stats} />

      {/* Achievement Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-orbitron font-bold text-xl text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            ACHIEVEMENT SHOWCASE
          </h3>
          <span className="text-xs text-muted-foreground">
            Unlocked: {currentUser.achievements?.length || 0} / {allAchievements.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAchievements.map((ach) => {
            const isUnlocked =
              unlockedAchievementIds.has(ach._id) ||
              unlockedAchievementIds.has(ach.key) ||
              currentUser.achievements?.some((a) => (a.key || a._id) === ach.key);
            return <AchievementBadge key={ach._id} achievement={ach} unlocked={isUnlocked} />;
          })}
        </div>
      </div>

      {/* Favorites & Battle Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Favorite Games */}
        <div className="space-y-4">
          <h3 className="font-orbitron font-bold text-lg text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            FAVORITE SQUAD GAMES ({currentUser.favorites?.length || 0})
          </h3>
          {currentUser.favorites?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentUser.favorites.map((favGame) => (
                <GameCard key={favGame._id || favGame} game={favGame} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground rounded-2xl border border-white/5 bg-black/20">
              No favorite games bookmarked yet. Heart any game in the catalog to add it here!
            </div>
          )}
        </div>

        {/* Recent Combat Log Activities */}
        <div className="space-y-4">
          <h3 className="font-orbitron font-bold text-lg text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Clock className="w-5 h-5 text-gaming-cyan" />
            RECENT BATTLE LOG
          </h3>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
