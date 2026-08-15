import api from './api';

export const aiService = {
  async getRecommendations(limit = 6) {
    const response = await api.get('/ai/recommendations', { params: { limit } });
    return response.data;
  },

  async getGameCoach(gameId) {
    const response = await api.get(`/ai/coach/${gameId}`);
    return response.data;
  },

  async getReviewSummary(gameId) {
    const response = await api.get(`/ai/reviews/summary/${gameId}`);
    return response.data;
  },

  async chat(message, conversationHistory = []) {
    const response = await api.post('/ai/chat', { message, conversationHistory });
    return response.data;
  },

  async generateAchievement(achievementType, difficulty) {
    const response = await api.post('/ai/achievements/generate', { achievementType, difficulty });
    return response.data;
  },

  async generateGameDescription(gameData) {
    const response = await api.post('/ai/games/generate-description', { gameData });
    return response.data;
  },
};

export default aiService;
