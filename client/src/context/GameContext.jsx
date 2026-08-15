import React, { createContext, useContext, useState, useEffect } from 'react';
import gameService from '../services/gameService';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export function GameProvider({ children }) {
  const { user, updateUserState } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGameToPlay, setActiveGameToPlay] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    category: '',
    difficulty: '',
    search: '',
    sort: '-rating',
  });

  const fetchGames = async (customParams = {}) => {
    setLoading(true);
    try {
      const data = await gameService.getGames({ ...filters, ...customParams });
      setGames(data.games || []);
      return data;
    } catch (err) {
      console.error('Failed to fetch games:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gameId) => {
    try {
      const data = await gameService.toggleFavorite(gameId);
      if (user && updateUserState) {
        updateUserState({
          ...user,
          favorites: data.favorites,
        });
      }
      return data;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  };

  const playGame = (game) => {
    setActiveGameToPlay(game);
    // Increment server play counter
    if (game?._id) {
      gameService.incrementPlayCount(game._id).catch(() => {});
    }
  };

  const closeGamePlayer = () => {
    setActiveGameToPlay(null);
  };

  return (
    <GameContext.Provider
      value={{
        games,
        loading,
        filters,
        setFilters,
        fetchGames,
        toggleFavorite,
        activeGameToPlay,
        playGame,
        closeGamePlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
