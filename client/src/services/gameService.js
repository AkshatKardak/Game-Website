import api from './api';

export const gameService = {
  async getGames(params = {}) {
    const response = await api.get('/games', { params });
    return response.data;
  },

  async getGame(id) {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  async getTrendingGames() {
    const response = await api.get('/games/trending');
    return response.data;
  },

  async getFeaturedGames() {
    const response = await api.get('/games/featured');
    return response.data;
  },

  async searchGames(query) {
    const response = await api.get('/games/search', { params: { q: query } });
    return response.data;
  },

  async toggleFavorite(gameId) {
    const response = await api.post(`/games/${gameId}/favorite`);
    return response.data;
  },

  async incrementPlayCount(gameId) {
    const response = await api.post(`/games/${gameId}/play`);
    return response.data;
  },

  async createGame(gameData) {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  async updateGame(id, gameData) {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  },

  async deleteGame(id) {
    const response = await api.delete(`/games/${id}`);
    return response.data;
  },
};

export default gameService;
