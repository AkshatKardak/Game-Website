import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Search, Filter, Sparkles } from 'lucide-react';
import { GameCard } from '@/components/games/GameCard';
import { GameFilters } from '@/components/games/GameFilters';
import { GameSearch } from '@/components/games/GameSearch';
import { Skeleton } from '@/components/ui/skeleton';
import gameService from '@/services/gameService';

export function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    sort: '-rating',
  });

  const fetchGames = async () => {
    setLoading(true);
    try {
      const queryParams = { ...filters };
      if (searchTerm.trim()) {
        queryParams.search = searchTerm.trim();
      }
      const data = await gameService.getGames(queryParams);
      setGames(data.games || []);
    } catch (err) {
      console.error('Failed to fetch games catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e && e.preventDefault();
    fetchGames();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-[80vh]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-gaming-purple font-orbitron text-xs font-bold mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>FULL BATTLE REPOSITORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-orbitron text-white">
            GALACTIC ARCADE CATALOG
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Explore and conquer interactive games directly inside your browser.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
          <GameSearch
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              if (!val) fetchGames();
            }}
            onClear={() => {
              setSearchTerm('');
              fetchGames();
            }}
          />
        </form>
      </div>

      {/* Filter Tabs & Pills */}
      <GameFilters
        filters={filters}
        setFilters={setFilters}
        onFilterChange={() => {}}
      />

      {/* Games Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      ) : games.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {games.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="p-16 text-center rounded-3xl border border-white/10 bg-gaming-card/40 my-8">
          <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-orbitron text-white mb-2">No games found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, genre category, or difficulty level.
          </p>
        </div>
      )}
    </div>
  );
}

export default Games;
