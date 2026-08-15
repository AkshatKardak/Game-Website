import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function GameSearch({ value, onChange, onClear }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gaming-purple" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search games, genres, battle arenas..."
        className="pl-10 pr-10 h-12 bg-black/50 border-white/15 focus-visible:ring-gaming-purple rounded-2xl text-sm"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default GameSearch;
