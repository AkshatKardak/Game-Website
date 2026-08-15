import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// Helper to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'galactic_super_secret_jwt_key_987654321_gaming_portal', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if username or email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new AppError('An account with this email address already exists', 400));
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new AppError('Username is already taken. Please choose another.', 400));
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    xp: 50, // Welcome XP bonus
    level: 1,
  });

  // Assign welcome achievement if it exists
  const welcomeBadge = await Achievement.findOne({ key: 'first_recruit' });
  if (welcomeBadge) {
    user.achievements.push(welcomeBadge._id);
    await user.save();
  }

  sendTokenResponse(user, 201, res, 'Account created successfully! Welcome to Galactic Squad.');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and include password for check
  const user = await User.findOne({ email }).select('+password').populate('achievements favorites');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Update streak if needed
  const now = new Date();
  const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
  if (lastLogin) {
    const diffHours = (now.getTime() - lastLogin.getTime()) / (1000 * 3600);
    if (diffHours >= 20 && diffHours <= 48) {
      user.streak += 1;
      user.xp += 20 * user.streak; // Daily streak XP
    } else if (diffHours > 48) {
      user.streak = 1;
    }
  }
  user.lastLoginDate = now;
  user.calculateLevel();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Logged in successfully.');
});

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('achievements favorites');
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});
