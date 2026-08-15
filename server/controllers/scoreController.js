import Score from '../models/Score.js';
import User from '../models/User.js';
import Game from '../models/Game.js';
import Achievement from '../models/Achievement.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Submit a new score from gameplay
// @route   POST /api/scores
// @access  Private
export const submitScore = catchAsync(async (req, res, next) => {
  const { gameId, score, duration = 0, completed = false, extraStats = {} } = req.body;
  const userId = req.user.id;

  const game = await Game.findById(gameId);
  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  // Create score record
  const newScore = await Score.create({
    user: userId,
    game: gameId,
    score,
    duration,
    completed,
    extraStats,
  });

  // Calculate XP earned: Base XP + score bonus
  const baseXP = 30;
  const scoreBonusXP = Math.min(Math.floor(score / 50), 200);
  const earnedXP = baseXP + scoreBonusXP;

  const user = await User.findById(userId).populate('achievements');
  const prevLevel = user.level;
  user.xp += earnedXP;
  user.totalScore += score;
  user.gamesPlayed += 1;
  const newLevel = user.calculateLevel();
  const leveledUp = newLevel > prevLevel;

  // Check achievement milestones
  const newlyUnlockedAchievements = [];

  const existingAchievementKeys = new Set(
    user.achievements.map((a) => (a.key ? a.key : a._id.toString()))
  );

  // Check 1: First Game Played
  if (user.gamesPlayed >= 1 && !existingAchievementKeys.has('first_blood')) {
    const ach = await Achievement.findOne({ key: 'first_blood' });
    if (ach) {
      user.achievements.push(ach._id);
      user.xp += ach.xpReward;
      newlyUnlockedAchievements.push(ach);
    }
  }

  // Check 2: High Scorer (Score >= 1000)
  if (score >= 1000 && !existingAchievementKeys.has('score_1000')) {
    const ach = await Achievement.findOne({ key: 'score_1000' });
    if (ach) {
      user.achievements.push(ach._id);
      user.xp += ach.xpReward;
      newlyUnlockedAchievements.push(ach);
    }
  }

  // Check 3: Master Scorer (Score >= 5000)
  if (score >= 5000 && !existingAchievementKeys.has('score_5000')) {
    const ach = await Achievement.findOne({ key: 'score_5000' });
    if (ach) {
      user.achievements.push(ach._id);
      user.xp += ach.xpReward;
      newlyUnlockedAchievements.push(ach);
    }
  }

  // Check 4: Veteran Gamer (10 games played)
  if (user.gamesPlayed >= 10 && !existingAchievementKeys.has('veteran_player')) {
    const ach = await Achievement.findOne({ key: 'veteran_player' });
    if (ach) {
      user.achievements.push(ach._id);
      user.xp += ach.xpReward;
      newlyUnlockedAchievements.push(ach);
    }
  }

  await user.save();

  // Determine user rank for this game
  const rank = await Score.countDocuments({
    game: gameId,
    score: { $gt: score },
  }) + 1;

  newScore.rank = rank;
  await newScore.save();

  res.status(201).json({
    success: true,
    message: 'Score submitted successfully!',
    score: newScore,
    earnedXP,
    newLevel: user.level,
    leveledUp,
    newAchievements: newlyUnlockedAchievements,
    rank,
  });
});

// @desc    Get global or game-specific leaderboards
// @route   GET /api/scores/leaderboard
// @access  Public
export const getLeaderboard = catchAsync(async (req, res, next) => {
  const { gameId, limit = 10 } = req.query;

  const matchQuery = {};
  if (gameId && gameId !== 'all') {
    matchQuery.game = gameId;
  }

  // Aggregate highest score per user
  const leaderboard = await Score.aggregate([
    { $match: matchQuery },
    { $sort: { score: -1 } },
    {
      $group: {
        _id: '$user',
        highScore: { $max: '$score' },
        totalPlays: { $sum: 1 },
        lastPlayed: { $max: '$createdAt' },
        game: { $first: '$game' },
      },
    },
    { $sort: { highScore: -1 } },
    { $limit: parseInt(limit, 10) },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    { $unwind: '$userInfo' },
    {
      $lookup: {
        from: 'games',
        localField: 'game',
        foreignField: '_id',
        as: 'gameInfo',
      },
    },
    {
      $project: {
        _id: 1,
        highScore: 1,
        totalPlays: 1,
        lastPlayed: 1,
        username: '$userInfo.username',
        avatar: '$userInfo.avatar',
        level: '$userInfo.level',
        xp: '$userInfo.xp',
        gameTitle: { $arrayElemAt: ['$gameInfo.title', 0] },
      },
    },
  ]);

  // Add rank numbers
  const ranked = leaderboard.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  res.status(200).json({
    success: true,
    leaderboard: ranked,
  });
});

// @desc    Get user scores history
// @route   GET /api/scores/user/:userId
// @access  Public
export const getUserScores = catchAsync(async (req, res, next) => {
  const scores = await Score.find({ user: req.params.userId })
    .populate('game', 'title image genre')
    .sort('-score')
    .limit(20);

  res.status(200).json({
    success: true,
    scores,
  });
});

// @desc    Get top scores for a single game
// @route   GET /api/scores/game/:gameId
// @access  Public
export const getGameScores = catchAsync(async (req, res, next) => {
  const scores = await Score.find({ game: req.params.gameId })
    .populate('user', 'username avatar level')
    .sort('-score')
    .limit(10);

  res.status(200).json({
    success: true,
    scores,
  });
});
