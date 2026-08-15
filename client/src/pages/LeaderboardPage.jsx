import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Leaderboard } from '@/components/user/Leaderboard';
import scoreService from '@/services/scoreService';
import gameService from '@/services/gameService';

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameService.getGames().then((data) => setGames(data.games || []));
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = selectedGameId !== 'all' ? { gameId: selectedGameId } : {};
      const data = await scoreService.getLeaderboard(params);
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGameId]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-orbitron text-xs font-bold mb-1">
            <Trophy className="w-4 h-4" />
            <span>GLOBAL HALL OF GLORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-orbitron text-white">
            QUADRANT RANKINGS
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Top scores logged across galactic combat arenas in real-time.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLeaderboard}
          className="self-start sm:self-auto border-gaming-purple/30 hover:bg-gaming-purple/20 font-orbitron text-xs"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Ranks
        </Button>
      </div>

      {/* Game Filter Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button
          variant={selectedGameId === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedGameId('all')}
          className={`font-orbitron text-xs rounded-xl whitespace-nowrap ${
            selectedGameId === 'all'
              ? 'bg-gaming-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]'
              : 'border-white/10 text-gray-300'
          }`}
        >
          🏆 All Arenas Combined
        </Button>

        {games.map((g) => (
          <Button
            key={g._id}
            variant={selectedGameId === g._id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGameId(g._id)}
            className={`font-orbitron text-xs rounded-xl whitespace-nowrap ${
              selectedGameId === g._id
                ? 'bg-gaming-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]'
                : 'border-white/10 text-gray-300'
            }`}
          >
            {g.title}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table with Top 3 Podium */}
      <Leaderboard entries={leaderboard} loading={loading} />
    </div>
  );
}

export default LeaderboardPage;
