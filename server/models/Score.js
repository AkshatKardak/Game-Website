import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    score: {
      type: Number,
      required: [true, 'Score value is required'],
    },
    duration: {
      type: Number, // duration in seconds
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    rank: {
      type: Number,
    },
    extraStats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast leaderboard lookups
scoreSchema.index({ game: 1, score: -1 });
scoreSchema.index({ user: 1, game: 1 });

const Score = mongoose.model('Score', scoreSchema);
export default Score;
