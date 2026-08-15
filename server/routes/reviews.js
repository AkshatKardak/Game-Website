import express from 'express';
import {
  getReviews,
  createReview,
  toggleLikeReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, createReview);
router.post('/:id/like', protect, toggleLikeReview);
router.delete('/:id', protect, deleteReview);

export default router;
