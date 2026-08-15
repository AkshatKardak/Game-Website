import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      default: null, // null for global leaderboard
    },
    period: {
      type: String,
      enum: ['all-time', 'weekly', 'monthly'],
      default: 'all-time',
    },
    entries: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        username: String,
        avatar: String,
        score: Number,
        rank: Number,
        level: Number,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
