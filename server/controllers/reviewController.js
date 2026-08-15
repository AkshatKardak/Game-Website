import Review from '../models/Review.js';
import Game from '../models/Game.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Get all reviews or filter by gameId
// @route   GET /api/reviews
// @access  Public
export const getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.query.gameId) {
    filter = { game: req.query.gameId };
  }

  const reviews = await Review.find(filter)
    .populate('user', 'username avatar level')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// @desc    Create new review for a game
// @route   POST /api/reviews
// @access  Private
export const createReview = catchAsync(async (req, res, next) => {
  const { gameId, rating, title, comment, pros = [], cons = [] } = req.body;
  const userId = req.user.id;

  const game = await Game.findById(gameId);
  if (!game) {
    return next(new AppError('Game not found', 404));
  }

  // Check if review already exists
  const existing = await Review.findOne({ game: gameId, user: userId });
  if (existing) {
    return next(new AppError('You have already reviewed this game. You can edit your review.', 400));
  }

  const review = await Review.create({
    game: gameId,
    user: userId,
    rating,
    title,
    comment,
    pros,
    cons,
  });

  // Recalculate average rating for game
  const reviews = await Review.find({ game: gameId });
  const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

  game.rating = parseFloat(avgRating.toFixed(1));
  game.totalRatings = reviews.length;
  await game.save();

  // Award XP for writing a community review
  await User.findByIdAndUpdate(userId, {
    $inc: { xp: 40 },
  });

  const populatedReview = await Review.findById(review._id).populate('user', 'username avatar level');

  res.status(201).json({
    success: true,
    message: 'Review posted successfully (+40 XP)!',
    review: populatedReview,
  });
});

// @desc    Like or unlike a review
// @route   POST /api/reviews/:id/like
// @access  Private
export const toggleLikeReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  const userId = req.user.id;
  const isLiked = review.likes.some((id) => id.toString() === userId.toString());

  if (isLiked) {
    review.likes = review.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    review.likes.push(userId);
    // Remove dislike if present
    review.dislikes = review.dislikes.filter((id) => id.toString() !== userId.toString());
  }

  await review.save();

  res.status(200).json({
    success: true,
    likesCount: review.likes.length,
    dislikesCount: review.dislikes.length,
    isLiked: !isLiked,
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  await review.deleteOne();

  // Recalculate game rating
  const reviews = await Review.find({ game: review.game });
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
    : 4.5;

  await Game.findByIdAndUpdate(review.game, {
    rating: parseFloat(avgRating.toFixed(1)),
    totalRatings: reviews.length,
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
