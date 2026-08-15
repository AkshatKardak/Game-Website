import express from 'express';
import {
  getAIRecommendations,
  getAIGameCoach,
  summarizeReviews,
  chatWithAI,
  generateAchievement,
  generateGameDesc,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply AI rate limiter to all AI routes
router.use(aiRateLimiter);

// Public / Semi-protected AI routes
router.post('/chat', chatWithAI);
router.get('/recommendations', getAIRecommendations);
router.get('/coach/:gameId', getAIGameCoach);
router.get('/reviews/summary/:gameId', summarizeReviews);

// Admin-only AI generation routes
router.post('/achievements/generate', protect, authorize('admin'), generateAchievement);
router.post('/games/generate-description', protect, authorize('admin'), generateGameDesc);

export default router;
