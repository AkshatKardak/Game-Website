import express from 'express';
import {
  getGames,
  getGame,
  getTrendingGames,
  getFeaturedGames,
  searchGames,
  toggleFavorite,
  incrementPlayCount,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/gameController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  createGameValidation,
  updateGameValidation,
} from '../validators/gameValidator.js';

const router = express.Router();

// Public routes
router.get('/', getGames);
router.get('/trending', getTrendingGames);
router.get('/featured', getFeaturedGames);
router.get('/search', searchGames);
router.get('/:id', getGame);
router.post('/:id/play', incrementPlayCount);

// Protected routes
router.post('/:id/favorite', protect, toggleFavorite);

// Admin routes
router.post('/', protect, authorize('admin'), createGameValidation, createGame);
router.put('/:id', protect, authorize('admin'), updateGameValidation, updateGame);
router.delete('/:id', protect, authorize('admin'), deleteGame);

export default router;
