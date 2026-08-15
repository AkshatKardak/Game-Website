import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Gamepad2,
  Trophy,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Brain,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import gameService from '@/services/gameService';
import aiService from '@/services/aiService';
import api from '@/services/api';

export function Admin() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');

  // AI Game Generator form state
  const [aiTitle, setAiTitle] = useState('');
  const [aiGenre, setAiGenre] = useState('Sci-Fi Combat');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedGameData, setGeneratedGameData] = useState(null);

  // AI Achievement Generator state
  const [achType, setAchType] = useState('Speedrun Champion');
  const [achRarity, setAchRarity] = useState('epic');
  const [achGenerating, setAchGenerating] = useState(false);
  const [generatedAch, setGeneratedAch] = useState(null);

  const [notification, setNotification] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [gamesRes, usersRes] = await Promise.all([
        gameService.getGames({ limit: 50 }),
        api.get('/users'),
      ]);
      setGames(gamesRes.games || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleGenerateGameDesc = async () => {
    if (!aiTitle.trim()) return;
    setAiGenerating(true);
    try {
      const res = await aiService.generateGameDescription({
        title: aiTitle,
        genre: aiGenre,
        category: 'action',
      });
      setGeneratedGameData(res.description);
    } catch (err) {
      console.error('Failed to generate description:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleDeployGeneratedGame = async () => {
    if (!generatedGameData) return;
    try {
      await gameService.createGame({
        title: aiTitle,
        description: generatedGameData.fullDescription || generatedGameData.shortDescription,
        genre: aiGenre,
        category: 'action',
        image: '/images/hero-banner.png',
        playableType: 'space-invaders',
        difficulty: generatedGameData.difficulty || 'medium',
        tags: generatedGameData.tags || ['Sci-Fi', 'AI Generated'],
      });
      setNotification(`🚀 Game "${aiTitle}" deployed to galactic catalog!`);
      setAiTitle('');
      setGeneratedGameData(null);
      loadAdminData();
      setTimeout(() => setNotification(''), 5000);
    } catch (err) {
      setNotification(`⚠️ ${err.message}`);
    }
  };

  const handleGenerateAchievement = async () => {
    setAchGenerating(true);
    try {
      const res = await aiService.generateAchievement(achType, achRarity);
      setGeneratedAch(res.achievement);
    } catch (err) {
      console.error('Failed to generate achievement:', err);
    } finally {
      setAchGenerating(false);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Confirm delete this game from repository?')) return;
    try {
      await gameService.deleteGame(gameId);
      setGames(games.filter((g) => g._id !== gameId));
      setNotification('Game deleted successfully.');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      setNotification(`⚠️ ${err.message}`);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">ACCESS RESTRICTED</h2>
        <p className="text-sm text-muted-foreground">Admin clearance required to enter this terminal.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-[85vh]">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-gaming-cyan font-orbitron text-xs font-bold mb-1">
            <Shield className="w-4 h-4" />
            <span>COMMAND MATRIX TERMINAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-orbitron text-white">
            ADMIN OVERSIGHT CONSOLE
          </h1>
        </div>

        <Badge variant="outline" className="font-orbitron text-xs border-gaming-purple text-gaming-purple self-start sm:self-auto">
          Security Level: ALPHA COMMANDER
        </Badge>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-gaming-purple/20 border border-gaming-purple/40 text-xs font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-white/10 bg-gaming-card p-4 rounded-2xl">
          <div className="text-[10px] text-muted-foreground font-orbitron uppercase">TOTAL REGISTERED PILOTS</div>
          <div className="text-2xl font-black font-orbitron text-white mt-1">{users.length}</div>
        </Card>
        <Card className="border border-white/10 bg-gaming-card p-4 rounded-2xl">
          <div className="text-[10px] text-muted-foreground font-orbitron uppercase">CATALOG GAMES</div>
          <div className="text-2xl font-black font-orbitron text-gaming-purple mt-1">{games.length}</div>
        </Card>
        <Card className="border border-white/10 bg-gaming-card p-4 rounded-2xl">
          <div className="text-[10px] text-muted-foreground font-orbitron uppercase">GROQ AI ENGINE</div>
          <div className="text-2xl font-black font-orbitron text-gaming-cyan mt-1">ONLINE 100%</div>
        </Card>
        <Card className="border border-white/10 bg-gaming-card p-4 rounded-2xl">
          <div className="text-[10px] text-muted-foreground font-orbitron uppercase">DATABASE STATUS</div>
          <div className="text-2xl font-black font-orbitron text-emerald-400 mt-1">CONNECTED</div>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/40 p-1 border border-white/10">
          <TabsTrigger value="games" className="font-orbitron text-xs">
            <Gamepad2 className="w-4 h-4 mr-2" /> Game Repository
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="font-orbitron text-xs">
            <Brain className="w-4 h-4 mr-2 text-gaming-purple" /> Groq AI Tools
          </TabsTrigger>
          <TabsTrigger value="users" className="font-orbitron text-xs">
            <Users className="w-4 h-4 mr-2" /> Pilots Registry
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Games Management */}
        <TabsContent value="games" className="mt-6 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-gaming-card/90 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 border-b border-white/10 text-muted-foreground uppercase font-orbitron">
                <tr>
                  <th className="p-4 pl-6">Game Title</th>
                  <th className="p-4">Genre</th>
                  <th className="p-4">Plays</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {games.map((g) => (
                  <tr key={g._id} className="hover:bg-white/5 font-medium">
                    <td className="p-4 pl-6 font-bold text-white font-orbitron flex items-center gap-3">
                      <img
                        src={g.image}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero-banner.png';
                        }}
                      />
                      <span>{g.title}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{g.genre}</td>
                    <td className="p-4 font-bold text-gaming-cyan">{g.plays || 0}</td>
                    <td className="p-4 text-amber-400 font-bold">★ {g.rating}</td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGame(g._id)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 2: Groq AI Tools */}
        <TabsContent value="ai-tools" className="mt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tool 1: AI Game Marketing Copy Generator */}
            <Card className="border border-gaming-purple/40 bg-gaming-card/90 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gaming-purple/20 text-gaming-purple border border-gaming-purple/40">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-base text-white">AI Game Copywriter</h3>
                  <p className="text-[11px] text-muted-foreground">Generates SEO descriptions & features with Groq Llama 3.3</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-orbitron text-muted-foreground block mb-1">GAME TITLE</label>
                  <Input
                    value={aiTitle}
                    onChange={(e) => setAiTitle(e.target.value)}
                    placeholder="e.g. Quantum Rift Raider"
                    className="text-xs bg-black/60"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-orbitron text-muted-foreground block mb-1">GENRE</label>
                  <Input
                    value={aiGenre}
                    onChange={(e) => setAiGenre(e.target.value)}
                    placeholder="e.g. Space Roguelike / Precision Racing"
                    className="text-xs bg-black/60"
                  />
                </div>
                <Button
                  onClick={handleGenerateGameDesc}
                  disabled={aiGenerating || !aiTitle.trim()}
                  className="w-full bg-gaming-purple hover:bg-gaming-purple/90 font-orbitron text-xs"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {aiGenerating ? 'Neural Generating...' : 'Generate Game Metadata'}
                </Button>
              </div>

              {generatedGameData && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs">
                  <div className="font-bold text-gaming-cyan font-orbitron">AI Generated Synopsis:</div>
                  <p className="text-gray-300 leading-relaxed">{generatedGameData.fullDescription}</p>
                  <div className="flex flex-wrap gap-1">
                    {generatedGameData.tags?.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={handleDeployGeneratedGame}
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 font-orbitron text-xs mt-2"
                  >
                    Deploy to Live Catalog
                  </Button>
                </div>
              )}
            </Card>

            {/* Tool 2: AI Achievement Generator */}
            <Card className="border border-gaming-cyan/40 bg-gaming-card/90 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gaming-cyan/20 text-gaming-cyan border border-gaming-cyan/40">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-base text-white">AI Achievement Forge</h3>
                  <p className="text-[11px] text-muted-foreground">Generates creative badges and XP rewards</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-orbitron text-muted-foreground block mb-1">THEME / OBJECTIVE</label>
                  <Input
                    value={achType}
                    onChange={(e) => setAchType(e.target.value)}
                    placeholder="e.g. Defeat Boss in Under 60 Seconds"
                    className="text-xs bg-black/60"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-orbitron text-muted-foreground block mb-1">RARITY TIER</label>
                  <select
                    value={achRarity}
                    onChange={(e) => setAchRarity(e.target.value)}
                    className="w-full h-11 bg-black/60 text-xs text-white rounded-lg border border-white/15 px-3"
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <Button
                  onClick={handleGenerateAchievement}
                  disabled={achGenerating}
                  className="w-full bg-gaming-blue hover:bg-gaming-blue/90 font-orbitron text-xs"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {achGenerating ? 'Forging Badge...' : 'Forge AI Achievement'}
                </Button>
              </div>

              {generatedAch && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron font-bold text-amber-400">{generatedAch.title}</span>
                    <Badge variant="accent">{generatedAch.rarity}</Badge>
                  </div>
                  <p className="text-gray-300">{generatedAch.description}</p>
                  <div className="text-gaming-cyan font-bold">Reward: +{generatedAch.xpReward} XP</div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Users Registry */}
        <TabsContent value="users" className="mt-6">
          <div className="rounded-3xl border border-white/10 bg-gaming-card/90 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 border-b border-white/10 text-muted-foreground uppercase font-orbitron">
                <tr>
                  <th className="p-4 pl-6">Pilot Callsign</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">XP</th>
                  <th className="p-4 pr-6 text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 font-medium">
                    <td className="p-4 pl-6 font-bold text-white font-orbitron flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span>{u.username}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4 font-bold text-gaming-purple">LVL {u.level || 1}</td>
                    <td className="p-4 text-gaming-cyan font-bold">{u.xp || 0}</td>
                    <td className="p-4 pr-6 text-right">
                      <Badge variant={u.role === 'admin' ? 'default' : 'outline'} className="text-[10px] font-orbitron">
                        {u.role?.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
