import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
} from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

export default router;
