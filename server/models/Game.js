import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Game description is required'],
    },
    genre: {
      type: String,
      required: [true, 'Game genre is required'],
    },
    category: {
      type: String,
      enum: ['action', 'puzzle', 'strategy', 'arcade', 'sports', 'racing', 'scifi'],
      default: 'action',
    },
    image: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    screenshots: {
      type: [String],
      default: [],
    },
    gameUrl: {
      type: String,
      default: 'internal', // internal playable canvas engine or external iframe
    },
    playableType: {
      type: String,
      enum: ['space-invaders', 'celestial-drift', 'stellar-strike', 'cyber-2048', 'neon-snake', 'iframe'],
      default: 'space-invaders',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalRatings: {
      type: Number,
      default: 1,
    },
    plays: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: ['Action', 'Arcade', 'Sci-Fi'],
    },
    developer: {
      type: String,
      default: 'Galactic Squad Studios',
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    isMultiplayer: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
gameSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'game',
  justOne: false,
});

const Game = mongoose.model('Game', gameSchema);
export default Game;
