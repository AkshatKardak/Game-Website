import express from 'express';
import {
  submitScore,
  getLeaderboard,
  getUserScores,
  getGameScores,
} from '../controllers/scoreController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/game/:gameId', getGameScores);
router.get('/user/:userId', getUserScores);
router.post('/', protect, submitScore);

export default router;
