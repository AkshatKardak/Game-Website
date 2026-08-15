import Game from '../models/Game.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc    Get all games with filters, sorting, search, pagination
// @route   GET /api/games
// @access  Public
export const getGames = catchAsync(async (req, res, next) => {
  const totalCount = await Game.countDocuments();
  const features = new APIFeatures(Game.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const games = await features.query;

  res.status(200).json({
    success: true,
    count: games.length,
    totalCount,
    games,
  });
});

// @desc    Get single game by ID or slug with reviews
// @route   GET /api/games/:id
// @access  Public
export const getGame = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let game;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    game = await Game.findById(id).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'username avatar level' },
    });
  } else {
    game = await Game.findOne({ slug: id }).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'username avatar level' },
    });
  }

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  res.status(200).json({
    success: true,
    game,
  });
});

// @desc    Get trending games
// @route   GET /api/games/trending
// @access  Public
export const getTrendingGames = catchAsync(async (req, res, next) => {
  const games = await Game.find({ isTrending: true }).limit(6).sort('-rating');
  res.status(200).json({
    success: true,
    games,
  });
});

// @desc    Get featured games
// @route   GET /api/games/featured
// @access  Public
export const getFeaturedGames = catchAsync(async (req, res, next) => {
  const games = await Game.find({ isFeatured: true }).limit(4);
  res.status(200).json({
    success: true,
    games,
  });
});

// @desc    Search games by text
// @route   GET /api/games/search
// @access  Public
export const searchGames = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q) {
    return res.status(200).json({ success: true, games: [] });
  }

  const regex = new RegExp(q, 'i');
  const games = await Game.find({
    $or: [{ title: regex }, { genre: regex }, { tags: { $in: [regex] } }, { category: regex }],
  }).limit(10);

  res.status(200).json({
    success: true,
    games,
  });
});

// @desc    Toggle favorite game for logged in user
// @route   POST /api/games/:id/favorite
// @access  Private
export const toggleFavorite = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  const user = await User.findById(req.user.id);
  const isFav = user.favorites.some((favId) => favId.toString() === game._id.toString());

  if (isFav) {
    user.favorites = user.favorites.filter((favId) => favId.toString() !== game._id.toString());
  } else {
    user.favorites.push(game._id);
    user.xp += 10; // XP for curating favorites
    user.calculateLevel();
  }

  await user.save();

  res.status(200).json({
    success: true,
    isFavorite: !isFav,
    favorites: user.favorites,
    message: !isFav ? 'Game added to favorites!' : 'Game removed from favorites.',
  });
});

// @desc    Increment play count for game
// @route   POST /api/games/:id/play
// @access  Public
export const incrementPlayCount = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndUpdate(
    req.params.id,
    { $inc: { plays: 1 } },
    { new: true }
  );

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { gamesPlayed: 1, xp: 25 },
    });
  }

  res.status(200).json({
    success: true,
    plays: game.plays,
  });
});

// @desc    Create new game (Admin)
// @route   POST /api/games
// @access  Private/Admin
export const createGame = catchAsync(async (req, res, next) => {
  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const game = await Game.create({ ...req.body, slug });

  res.status(201).json({
    success: true,
    game,
  });
});

// @desc    Update game (Admin)
// @route   PUT /api/games/:id
// @access  Private/Admin
export const updateGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  res.status(200).json({
    success: true,
    game,
  });
});

// @desc    Delete game (Admin)
// @route   DELETE /api/games/:id
// @access  Private/Admin
export const deleteGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.params.id);

  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Game deleted successfully',
  });
});
