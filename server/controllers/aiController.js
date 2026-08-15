import { callGroqAI } from '../config/groq.js';
import Game from '../models/Game.js';
import User from '../models/User.js';
import Score from '../models/Score.js';
import Review from '../models/Review.js';
import catchAsync from '../utils/catchAsync.js';

// Cache map for AI recommendations to optimize latency and costs
const recommendationsCache = new Map();

// @desc    Get AI-Powered Game Recommendations
// @route   GET /api/ai/recommendations
// @access  Public / Optional Auth
export const getAIRecommendations = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const userId = req.user?.id;

  if (userId) {
    const cached = recommendationsCache.get(`recs:${userId}`);
    if (cached && Date.now() - cached.timestamp < 1800000) { // 30 min cache
      return res.status(200).json({ success: true, recommendations: cached.data });
    }
  }

  const allGames = await Game.find({}).select('title genre category rating tags difficulty image');

  let userContext = {
    level: 1,
    gamesPlayed: 0,
    favorites: [],
    recentGames: [],
  };

  if (userId) {
    const user = await User.findById(userId).populate('favorites');
    const recentScores = await Score.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('game', 'title genre');

    if (user) {
      userContext = {
        level: user.level,
        gamesPlayed: user.gamesPlayed,
        favorites: user.favorites.map((g) => g.genre),
        recentGames: recentScores.map((s) => s.game?.title).filter(Boolean),
      };
    }
  }

  const prompt = `
You are an expert galactic game recommendation engine.
Analyze the user profile and recommend up to ${limit} games they will love.

USER PROFILE:
- Level: ${userContext.level}
- Games Played: ${userContext.gamesPlayed}
- Favorite Genres: ${userContext.favorites.join(', ') || 'Sci-Fi, Action, Arcade'}
- Recently Played: ${userContext.recentGames.join(', ') || 'None yet'}

AVAILABLE GAMES IN CATALOG:
${allGames.map((g) => `- ID: ${g._id} | Title: "${g.title}" | Genre: ${g.genre} | Category: ${g.category} | Rating: ${g.rating} | Difficulty: ${g.difficulty}`).join('\n')}

Format your response STRICTLY as a valid JSON array of objects:
[
  {
    "gameId": "string matching one of the ID values above",
    "title": "Exact Title of game from catalog",
    "reason": "1-2 engaging sentences explaining why this game suits the player",
    "matchScore": 85 to 99
  }
]
Return ONLY JSON without markdown backticks or commentary.
`;

  try {
    const responseText = await callGroqAI(
      [
        { role: 'system', content: 'You are an intelligent gaming recommendation AI. Output purely valid JSON.' },
        { role: 'user', content: prompt },
      ],
      { model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', temperature: 0.7 }
    );

    let recommendations = [];
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    recommendations = JSON.parse(cleanJson);

    // Attach full game data (image, rating, etc.)
    const enrichedRecs = recommendations.map((rec) => {
      const matchGame = allGames.find(
        (g) => g._id.toString() === rec.gameId || g.title.toLowerCase() === rec.title.toLowerCase()
      );
      return {
        ...rec,
        gameId: matchGame ? matchGame._id : rec.gameId,
        image: matchGame ? matchGame.image : '/images/hero-banner.png',
        genre: matchGame ? matchGame.genre : 'Sci-Fi Action',
        rating: matchGame ? matchGame.rating : 4.9,
      };
    });

    if (userId) {
      recommendationsCache.set(`recs:${userId}`, { data: enrichedRecs, timestamp: Date.now() });
    }

    res.status(200).json({
      success: true,
      recommendations: enrichedRecs,
    });
  } catch (error) {
    // Graceful fallback from catalog
    const fallbackRecs = allGames.slice(0, limit).map((g, index) => ({
      gameId: g._id,
      title: g.title,
      image: g.image,
      genre: g.genre,
      rating: g.rating,
      reason: `Thrilling ${g.genre} experience optimized for high scores and competitive leaderboards.`,
      matchScore: 96 - index * 3,
    }));

    res.status(200).json({
      success: true,
      recommendations: fallbackRecs,
    });
  }
});

// @desc    Get AI Game Coach tips & tactics for a specific game
// @route   GET /api/ai/coach/:gameId
// @access  Public / Optional Auth
export const getAIGameCoach = catchAsync(async (req, res, next) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game not found' });
  }

  let userStats = null;
  if (req.user) {
    userStats = await Score.findOne({ user: req.user.id, game: gameId }).sort({ score: -1 });
  }

  const prompt = `
You are an elite eSports and sci-fi game coach for the game "${game.title}".
GAME INFO:
- Genre: ${game.genre}
- Category: ${game.category}
- Difficulty: ${game.difficulty}
- Description: ${game.description}

PLAYER STATUS:
${userStats ? `- High Score: ${userStats.score}\n- Playtime: ${userStats.duration}s` : '- New recruit initiating first battle'}

Provide high-impact, tactical coaching advice formatted as a JSON object:
{
  "gettingStarted": ["Tip 1", "Tip 2", "Tip 3"],
  "advancedStrategies": ["Strategy 1", "Strategy 2", "Strategy 3"],
  "commonMistakes": ["Mistake 1 to avoid", "Mistake 2 to avoid", "Mistake 3 to avoid"],
  "proTips": ["Pro tip 1", "Pro tip 2"],
  "motivationalMessage": "Inspiring warrior quote for the player"
}
Return ONLY valid JSON.
`;

  try {
    const responseText = await callGroqAI(
      [
        { role: 'system', content: 'You are an expert game coach. Always respond with pure JSON.' },
        { role: 'user', content: prompt },
      ],
      { model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', temperature: 0.75 }
    );

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const coaching = JSON.parse(cleanJson);

    res.status(200).json({
      success: true,
      coaching,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      coaching: {
        gettingStarted: [
          'Calibrate your weapon firing rate to avoid heat build-up.',
          'Collect shield pickups immediately after wave clears.',
          'Focus on perimeter targets first to reduce incoming crossfire.',
        ],
        advancedStrategies: [
          'Perform micro-dodges using rapid pulse thrusters.',
          'Chain combo multipliers by destroying ships within 2 seconds of each other.',
          'Save your ultimate ability for elite squadron commanders.',
        ],
        commonMistakes: [
          'Staying stationary in open galactic space.',
          'Ignoring the mini-radar tracking flanking raiders.',
          'Overheating main plasma blasters.',
        ],
        proTips: [
          'Use asteroid momentum to slingshot around enemy laser grids.',
          'Time your shield bursts right as heavy torpedoes detonate.',
        ],
        motivationalMessage: 'Victory belongs to the boldest pilot in the quadrant. Take flight and claim your crown!',
      },
    });
  }
});

// @desc    Get AI Review Summarizer & Sentiment Insights
// @route   GET /api/ai/reviews/summary/:gameId
// @access  Public
export const summarizeReviews = catchAsync(async (req, res, next) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  const reviews = await Review.find({ game: gameId }).populate('user', 'username').limit(20);

  if (!reviews || reviews.length === 0) {
    return res.status(200).json({
      success: true,
      summary: {
        overallSummary: `Players are eager to dive into ${game ? game.title : 'this game'}. Be the first commander to submit an in-depth battle report!`,
        pros: ['Smooth visual effects', 'Intuitive controls', 'High replayability'],
        cons: ['Awaiting more community reviews'],
        sentiment: 'positive',
        averageRating: game ? game.rating : 4.8,
        recommendationRate: 98,
        keyInsights: ['Exciting addition to the Galactic Squad library', 'Optimized for high-FPS browser gameplay'],
      },
    });
  }

  const reviewText = reviews.map((r, i) => `Pilot ${r.user?.username || i + 1} (${r.rating}/5): ${r.comment}`).join('\n');

  const prompt = `
Analyze these player reviews for "${game.title}" and synthesize an intelligent community summary:
REVIEWS:
${reviewText}

Format your response strictly as JSON:
{
  "overallSummary": "2-3 sentences synthesizing consensus",
  "pros": ["Top 3 positive highlights"],
  "cons": ["Top 2 constructive critiques or challenges"],
  "sentiment": "positive",
  "averageRating": ${game.rating},
  "recommendationRate": 95,
  "keyInsights": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"]
}
Return ONLY valid JSON.
`;

  try {
    const responseText = await callGroqAI(
      [
        { role: 'system', content: 'You are an AI sentiment and review analyst. Output pure JSON.' },
        { role: 'user', content: prompt },
      ],
      { model: process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant', temperature: 0.5 }
    );

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const summary = JSON.parse(cleanJson);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      summary: {
        overallSummary: `Players love the responsive mechanics, intense visual feedback, and rewarding progression of ${game.title}.`,
        pros: ['Responsive arcade controls', 'Vibrant neon graphics', 'Addictive gameplay loop'],
        cons: ['Later waves require high concentration'],
        sentiment: 'positive',
        averageRating: game.rating,
        recommendationRate: 96,
        keyInsights: ['Superb tactical arcade experience', 'Great community engagement and leaderboards'],
      },
    });
  }
});

// @desc    Interactive 24/7 AI Gaming Chatbot
// @route   POST /api/ai/chat
// @access  Public / Optional Auth
export const chatWithAI = catchAsync(async (req, res, next) => {
  const { message, conversationHistory = [] } = req.body;
  const user = req.user;

  if (!message || message.trim() === '') {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const prompt = `
You are the official AI Cyber Assistant for Galactic Squad Gaming Hub.
You help users discover games, provide gaming strategies, explain XP/leveling/achievements, and chat about sci-fi gaming lore with high enthusiasm.

USER CONTEXT:
- Name: ${user ? user.username : 'Space Traveler'}
- Level: ${user ? user.level : 'Cadet'}
- Games Played: ${user ? user.gamesPlayed : 'Exploring'}

USER MESSAGE: ${message}

Keep responses friendly, punchy (2-4 sentences max), and use gaming/sci-fi flair with emojis!
`;

  const messages = [
    { role: 'system', content: 'You are the helpful, energetic AI gaming assistant for Galactic Squad.' },
    ...conversationHistory.slice(-4),
    { role: 'user', content: prompt },
  ];

  try {
    const response = await callGroqAI(messages, {
      model: process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 300,
    });

    res.status(200).json({
      success: true,
      response: response || "Commander, all systems operational! Ready to conquer the next high score?",
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      response: "Greetings Commander! 🚀 I'm ready to assist you with game tips, leaderboard secrets, and squad strategies!",
    });
  }
});

// @desc    Generate Achievement Metadata (Admin)
// @route   POST /api/ai/achievements/generate
// @access  Private/Admin
export const generateAchievement = catchAsync(async (req, res, next) => {
  const { achievementType = 'score milestone', difficulty = 'epic' } = req.body;

  const prompt = `
Generate a creative, exciting achievement for a sci-fi gaming platform.
TYPE: ${achievementType}
RARITY: ${difficulty}

Output JSON format:
{
  "title": "Creative Achievement Name",
  "description": "Engaging description of how it is unlocked",
  "icon": "trophy|flame|star|zap|shield|crown|sword",
  "xpReward": 250,
  "rarity": "${difficulty}",
  "condition": "Specific trigger condition"
}
Return only JSON.
`;

  const responseText = await callGroqAI([
    { role: 'system', content: 'You are a game designer creating achievements. Output only JSON.' },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const achievement = JSON.parse(cleanJson);
    res.status(200).json({ success: true, achievement });
  } catch (err) {
    res.status(200).json({
      success: true,
      achievement: {
        title: 'Cosmic Overlord',
        description: 'Achieve a score of 10,000 in any arcade arena without losing a single life.',
        icon: 'crown',
        xpReward: 300,
        rarity: 'legendary',
        condition: 'Score >= 10,000 in one run',
      },
    });
  }
});

// @desc    Generate Game Description and Features (Admin)
// @route   POST /api/ai/games/generate-description
// @access  Private/Admin
export const generateGameDesc = catchAsync(async (req, res, next) => {
  const { gameData } = req.body;

  const prompt = `
Generate an engaging, SEO-friendly game description and feature list for:
Title: ${gameData?.title || 'Galactic Arena'}
Genre: ${gameData?.genre || 'Sci-Fi Combat'}
Category: ${gameData?.category || 'Action'}

Output JSON format:
{
  "shortDescription": "1-2 sentence teaser",
  "fullDescription": "Full exciting description (100-200 words)",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "tags": ["Tag1", "Tag2", "Tag3"],
  "difficulty": "medium"
}
Return only JSON.
`;

  const responseText = await callGroqAI([
    { role: 'system', content: 'You are a gaming copywriter. Output only JSON.' },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const generated = JSON.parse(cleanJson);
    res.status(200).json({ success: true, description: generated });
  } catch (err) {
    res.status(200).json({
      success: true,
      description: {
        shortDescription: 'Engage in heart-pounding zero-gravity battles with modern physics and multiplayer thrills.',
        fullDescription: 'Take command of legendary starships across asteroid belts and hostile alien frontiers. Master dynamic projectile trajectories, upgrade custom blasters, and climb the global leaderboards.',
        features: ['Realistic zero-g arcade physics', 'Custom neon starships', 'Real-time high score leaderboards'],
        tags: ['Space', 'Action', 'Arcade', 'Shooter'],
        difficulty: 'medium',
      },
    });
  }
});
