import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Layers, Zap, Flame, Sparkles } from 'lucide-react';

export function GameFilters({ filters, setFilters, onFilterChange }) {
  const categories = [
    { label: 'All Arenas', value: '' },
    { label: 'Action & Combat', value: 'action' },
    { label: 'Speed & Racing', value: 'racing' },
    { label: 'Arcade Classic', value: 'arcade' },
    { label: 'Tactics & Puzzle', value: 'puzzle' },
  ];

  const difficulties = [
    { label: 'All Tiers', value: '' },
    { label: 'Recruit (Easy)', value: 'easy' },
    { label: 'Officer (Medium)', value: 'medium' },
    { label: 'Commander (Hard)', value: 'hard' },
  ];

  const sortOptions = [
    { label: 'Highest Rated', value: '-rating' },
    { label: 'Most Played', value: '-plays' },
    { label: 'Newest Arrivals', value: '-createdAt' },
  ];

  const handleCategorySelect = (val) => {
    const updated = { ...filters, category: val };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleDifficultySelect = (val) => {
    const updated = { ...filters, difficulty: val };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleSortSelect = (e) => {
    const updated = { ...filters, sort: e.target.value };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filters.category === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategorySelect(cat.value)}
            className={`whitespace-nowrap font-orbitron text-xs rounded-xl transition-all ${
              filters.category === cat.value
                ? 'bg-gaming-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                : 'border-white/10 hover:border-gaming-purple/40 text-gray-300'
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Secondary Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase font-orbitron flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gaming-purple" />
            DIFFICULTY:
          </span>
          <div className="flex gap-1.5">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => handleDifficultySelect(diff.value)}
                className={`px-3 py-1 text-xs rounded-lg transition-all ${
                  filters.difficulty === diff.value
                    ? 'bg-gaming-cyan/20 text-gaming-cyan border border-gaming-cyan/50 font-bold'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase font-orbitron">SORT:</span>
          <select
            value={filters.sort || '-rating'}
            onChange={handleSortSelect}
            className="bg-gaming-card text-xs text-gray-200 border border-white/15 rounded-xl px-3 py-1.5 focus:outline-none focus:border-gaming-purple"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default GameFilters;
