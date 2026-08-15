import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getUserStats,
  getUserActivity,
  getAllUsers,
  updateUserRole,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { updateProfileValidation } from '../validators/userValidator.js';

const router = express.Router();

router.put('/profile', protect, updateProfileValidation, updateProfile);
router.get('/:id', getUserProfile);
router.get('/:id/stats', getUserStats);
router.get('/:id/activity', getUserActivity);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
