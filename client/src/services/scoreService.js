import api from './api';

export const scoreService = {
  async submitScore(scoreData) {
    const response = await api.post('/scores', scoreData);
    return response.data;
  },

  async getLeaderboard(params = {}) {
    const response = await api.get('/scores/leaderboard', { params });
    return response.data;
  },

  async getUserScores(userId) {
    const response = await api.get(`/scores/user/${userId}`);
    return response.data;
  },

  async getGameScores(gameId) {
    const response = await api.get(`/scores/game/${gameId}`);
    return response.data;
  },
};

export default scoreService;
