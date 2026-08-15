import User from '../models/User.js';
import Score from '../models/Score.js';
import Achievement from '../models/Achievement.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Get user profile with populated achievements & favorites
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('achievements')
    .populate('favorites');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {};
  if (req.body.bio !== undefined) fieldsToUpdate.bio = req.body.bio;
  if (req.body.avatar !== undefined) fieldsToUpdate.avatar = req.body.avatar;

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).populate('achievements favorites');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
export const getUserStats = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const scores = await Score.find({ user: req.params.id });
  const totalPlaytime = scores.reduce((acc, s) => acc + (s.duration || 0), 0);
  const highestScore = scores.reduce((max, s) => Math.max(max, s.score), 0);

  res.status(200).json({
    success: true,
    stats: {
      level: user.level,
      xp: user.xp,
      gamesPlayed: user.gamesPlayed,
      totalScore: user.totalScore,
      highestScore,
      totalPlaytimeSeconds: totalPlaytime,
      streak: user.streak,
      achievementsCount: user.achievements?.length || 0,
      favoritesCount: user.favorites?.length || 0,
    },
  });
});

// @desc    Get user activity feed
// @route   GET /api/users/:id/activity
// @access  Public
export const getUserActivity = catchAsync(async (req, res, next) => {
  const scores = await Score.find({ user: req.params.id })
    .populate('game', 'title image genre')
    .sort('-createdAt')
    .limit(10);

  const activities = scores.map((s) => ({
    id: s._id,
    type: 'game_played',
    title: `Scored ${s.score.toLocaleString()} in ${s.game?.title || 'a galactic game'}`,
    timestamp: s.createdAt,
    game: s.game,
    score: s.score,
  }));

  res.status(200).json({
    success: true,
    activities,
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort('-createdAt').select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Update user role or ban (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user,
  });
});
