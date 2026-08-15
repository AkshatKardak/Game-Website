import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let groqClient = null;

if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '') {
  try {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    console.log('🤖 Groq AI Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Groq SDK initialization warning:', err.message);
  }
} else {
  console.log('ℹ️ No GROQ_API_KEY set in server/.env. Using built-in intelligent simulated AI responses.');
}

export const groq = groqClient;

/**
 * Call Groq AI API or fallback to context-aware simulated AI response
 */
export async function callGroqAI(messages, options = {}) {
  const model = options.model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const temperature = options.temperature || 0.7;
  const max_tokens = options.max_tokens || 1024;

  if (groqClient) {
    try {
      const response = await groqClient.chat.completions.create({
        messages,
        model,
        temperature,
        max_tokens,
        top_p: options.top_p || 1,
      });

      const content = response.choices[0]?.message?.content || '';
      return content;
    } catch (error) {
      console.warn('Groq API Error (falling back to smart AI generator):', error.message);
    }
  }

  // Smart fallback simulator based on user request prompt context
  return generateSimulatedAIResponse(messages);
}

/**
 * Smart contextual fallback generator for AI features
 */
function generateSimulatedAIResponse(messages) {
  const userMsg = messages.find(m => m.role === 'user')?.content || '';
  const isJsonExpected = messages.some(m => m.content?.includes('JSON') || m.content?.includes('json'));

  if (userMsg.includes('official AI Cyber Assistant') || userMsg.includes('AI Gaming Co-Pilot') || messages.some(m => m.content?.includes('Galactic Squad Gaming Hub'))) {
    if (userMsg.toLowerCase().includes('recommend')) {
      return "Commander, I strongly suggest trying Planetary Battle Royale if you love space arcade combat, or Celestial Drift for high-speed asteroid dodging!";
    }
    if (userMsg.toLowerCase().includes('xp') || userMsg.toLowerCase().includes('level')) {
      return "You can earn XP by playing any arcade game, submitting battle scores, unlocking achievement badges, and writing reviews (+40 XP)!";
    }
    if (userMsg.toLowerCase().includes('tips') || userMsg.toLowerCase().includes('strategy')) {
      return "Pro combat tip: In Planetary Battle Royale, clear peripheral scouts first and conserve your laser fire to avoid overheating!";
    }
    return "Greetings Commander! 🚀 I am your Galactic AI assistant. Ask me about game tips, strategies, or high score secrets anytime!";
  }

  if (userMsg.includes('RECOMMENDATIONS') || (userMsg.includes('recommend') && isJsonExpected)) {
    return JSON.stringify([
      {
        gameId: "rec-1",
        title: "Planetary Battle Royale",
        reason: "Matches your tactical space combat preferences with deep RTS fleet mechanics and thrilling zero-g combat.",
        matchScore: 98
      },
      {
        gameId: "rec-2",
        title: "Celestial Drift",
        reason: "High octane neon racing that rewards quick reflex mastery and leaderboard competition.",
        matchScore: 94
      },
      {
        gameId: "rec-3",
        title: "Stellar Strike",
        reason: "Perfect for action seekers looking for dynamic zero-g boss fights and precision laser physics.",
        matchScore: 91
      },
      {
        gameId: "rec-4",
        title: "Cyber 2048",
        reason: "Excellent puzzle challenger to test spatial awareness and strategic numerical synthesis.",
        matchScore: 88
      }
    ]);
  }

  if (userMsg.includes('game coach') || userMsg.includes('COACH') || userMsg.includes('Getting Started')) {
    return JSON.stringify({
      gettingStarted: [
        "Master the directional thrusters early to preserve momentum during tight navigation turns.",
        "Prioritize collecting energy cores before triggering major weapon overload phases.",
        "Keep an eye on the shield depletion meter and use terrain cover strategically."
      ],
      advancedStrategies: [
        "Execute rapid brake-drifts right before projectile impact to evade zero-g homing missiles.",
        "Chain multiplier combos by defeating consecutive target waves without taking hull damage.",
        "Synthesize high-tier upgrades right before elite boss phases to maximize burst DPS."
      ],
      commonMistakes: [
        "Holding continuous fire and causing plasma weapon overheating at critical battle moments.",
        "Ignoring peripheral radar pings indicating flanking enemy squadrons.",
        "Rushing into dense asteroid fields without checking velocity drift vectors."
      ],
      proTips: [
        "Utilize gravity slingshots around planetary orbits to double your boost speed without fuel cost.",
        "Sync ultimate ability activations when multiple high-value targets cluster together."
      ],
      motivationalMessage: "You are climbing the ranks rapidly! Stay focused on your movement patterns and the top leaderboard spot is yours."
    });
  }

  if (userMsg.includes('Analyze these game reviews') || userMsg.includes('REVIEWS:')) {
    return JSON.stringify({
      overallSummary: "Players overwhelmingly praise the fluid combat responsiveness, stunning neon visual aesthetics, and addictive progression loop, while noting the high difficulty in later stages.",
      pros: [
        "Ultra-smooth physics and responsive arcade controls",
        "Spectacular cyberpunk visual style and particle effects",
        "Deep XP leveling and rewarding achievement unlocks"
      ],
      cons: [
        "Steep difficulty curve on higher waves",
        "Requires fast reflexes to master end-game mechanics"
      ],
      sentiment: "positive",
      averageRating: 4.8,
      recommendationRate: 95,
      keyInsights: [
        "Highly recommended for competitive arcade and strategy fans",
        "Boss encounters are challenging yet extremely satisfying",
        "Sound design and audio feedback elevate gameplay immersion"
      ]
    });
  }

  if (userMsg.includes('official AI Cyber Assistant') || userMsg.includes('AI Gaming Co-Pilot')) {
    if (userMsg.toLowerCase().includes('recommend')) {
      return "I highly recommend launching into Planetary Battle Royale if you love tactical RTS and space dogfights, or Celestial Drift for high-octane reflex challenges!";
    }
    if (userMsg.toLowerCase().includes('xp') || userMsg.toLowerCase().includes('level')) {
      return "You gain XP by completing game runs, setting high scores, reviewing games (+40 XP), and maintaining daily login streaks! Leveling up unlocks elite profile badges.";
    }
    if (userMsg.toLowerCase().includes('tips') || userMsg.toLowerCase().includes('strategy')) {
      return "For Planetary Battle Royale: Focus on clearing perimeter scout ships first to avoid crossfire, and conserve your weapon bursts to prevent laser overheating!";
    }
    return "Greetings Commander! 🚀 I am your Galactic AI assistant. Whether you need combat strategies, game recommendations, or leaderboard insights, I'm here to power up your gaming journey!";
  }

  if (userMsg.includes('ACHIEVEMENT TYPE:')) {
    return JSON.stringify({
      title: "Cosmic Apex Champion",
      description: "Demonstrated unmatched mastery by decimating 50 elite squadrons without suffering a single hull breach.",
      motivationalMessage: "A true galactic legend has arisen! The stars bow to your combat supremacy.",
      rarity: "legendary",
      xpReward: 350,
      icon: "trophy"
    });
  }

  if (userMsg.includes('SEO-friendly game description') || userMsg.includes('GAME DETAILS:')) {
    return JSON.stringify({
      shortDescription: "Dominate the galaxy in this high-intensity zero-g combat thriller packed with neon visuals and real-time fleet battles.",
      fullDescription: "Step into the cockpit of the most advanced starfighters in the known universe. Engage in pulse-pounding space dogfights, outmaneuver enemy fleets through hazardous asteroid fields, and conquer rival warlords to claim galactic supremacy. Featuring state-of-the-art physics, custom ship loadouts, and global leaderboards.",
      features: [
        "Real-time zero-gravity combat physics",
        "Diverse weapon loadouts and ship customizers",
        "Global real-time competitive leaderboards and achievement tracks"
      ],
      tags: ["Space", "Action", "Cyberpunk", "Multiplayer", "Arcade"],
      seoKeywords: ["space combat game", "sci-fi arcade", "browser space shooter"]
    });
  }

  // Conversational response
  if (isJsonExpected) {
    return JSON.stringify({ response: "AI assistant processed your gaming request successfully." });
  }

  return "Greetings Commander! 🚀 I am your Galactic AI assistant. Whether you need combat strategies, game recommendations, or leaderboard insights, I'm here to power up your gaming journey!";
}

export default groq;
