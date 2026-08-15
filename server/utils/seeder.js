import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Game from '../models/Game.js';
import Achievement from '../models/Achievement.js';
import Score from '../models/Score.js';
import Review from '../models/Review.js';

dotenv.config();

const achievementsData = [
  {
    title: 'Galactic Recruit',
    key: 'first_recruit',
    description: 'Enlisted in the Galactic Squad network and created your battle profile.',
    icon: 'shield',
    xpReward: 50,
    condition: 'Account created',
    category: 'social',
    rarity: 'common',
  },
  {
    title: 'First Blood',
    key: 'first_blood',
    description: 'Launched into battle and completed your very first game simulation.',
    icon: 'zap',
    xpReward: 100,
    condition: 'Play 1 game',
    category: 'gameplay',
    rarity: 'common',
  },
  {
    title: 'Centurion 1,000+',
    key: 'score_1000',
    description: 'Surpassed 1,000 points in an arcade arena run.',
    icon: 'star',
    xpReward: 150,
    condition: 'Score >= 1,000 points',
    category: 'achievement',
    rarity: 'rare',
  },
  {
    title: 'Cosmic Dominator 5,000+',
    key: 'score_5000',
    description: 'Crushed the enemy vanguard with over 5,000 high score points.',
    icon: 'trophy',
    xpReward: 300,
    condition: 'Score >= 5,000 points',
    category: 'achievement',
    rarity: 'epic',
  },
  {
    title: 'Veteran Fleet Commander',
    key: 'veteran_player',
    description: 'Commanded 10 battle missions across galactic space.',
    icon: 'crown',
    xpReward: 250,
    condition: 'Play 10 games',
    category: 'gameplay',
    rarity: 'epic',
  },
  {
    title: 'Apex Sovereign',
    key: 'apex_sovereign',
    description: 'Achieved legendary status through absolute galactic supremacy.',
    icon: 'flame',
    xpReward: 500,
    condition: 'Reach Level 10 or score 10,000+',
    category: 'special',
    rarity: 'legendary',
  },
];

const gamesData = [
  {
    title: 'Planetary Battle Royale',
    slug: 'planetary-battle-royale',
    description: 'Lead your starfighter fleet to victory in an intense real-time zero-gravity space shooter. Blast invading raider squadrons, dodge photon torpedoes, and unleash quantum blast waves.',
    genre: 'Space Combat / Arcade Shooter',
    category: 'action',
    image: '/images/Planet Royale.png',
    screenshots: ['/images/Planet Royale.png', '/images/hero-banner.png'],
    gameUrl: 'internal',
    playableType: 'space-invaders',
    rating: 4.9,
    totalRatings: 18,
    plays: 342,
    difficulty: 'medium',
    tags: ['Space', 'Action', 'Arcade', 'Shooter', 'Sci-Fi'],
    developer: 'Galactic Squad Studios',
    isFeatured: true,
    isTrending: true,
  },
  {
    title: 'Celestial Drift',
    slug: 'celestial-drift',
    description: 'Navigate treacherous asteroid fields and quantum slipstreams at supersonic speeds. Collect cosmic energy orbs, evade laser walls, and beat the clock.',
    genre: 'Sci-Fi Runner / Speed Racer',
    category: 'racing',
    image: '/images/Celestial.png',
    screenshots: ['/images/Celestial.png', '/images/news-1.jpg'],
    gameUrl: 'internal',
    playableType: 'celestial-drift',
    rating: 4.8,
    totalRatings: 14,
    plays: 289,
    difficulty: 'hard',
    tags: ['Racing', 'Fast-Paced', 'Reflex', 'Cyberpunk', 'Space'],
    developer: 'Galactic Squad Studios',
    isFeatured: true,
    isTrending: true,
  },
  {
    title: 'Stellar Strike',
    slug: 'stellar-strike',
    description: 'Zero-gravity precision physics shooter. Defend the orbital defense matrix against waves of cyber-drones and rogue battle stations with bounce lasers.',
    genre: 'Arcade Combat / Laser Defense',
    category: 'arcade',
    image: '/images/Stellar Striker.png',
    screenshots: ['/images/Stellar Striker.png', '/images/news-2.jpg'],
    gameUrl: 'internal',
    playableType: 'stellar-strike',
    rating: 4.7,
    totalRatings: 12,
    plays: 215,
    difficulty: 'medium',
    tags: ['Defense', 'Arcade', 'Physics', 'Action'],
    developer: 'Galactic Squad Studios',
    isFeatured: true,
    isTrending: false,
  },
  {
    title: 'Cyber 2048: Galactic Fusion',
    slug: 'cyber-2048-galactic-fusion',
    description: 'Synthesize raw energy crystals and galactic dark matter cells. Slide and merge isotope matrices in a sleek cyberpunk puzzle grid to reach the 2048 Singularity.',
    genre: 'Cyberpunk Puzzle / Strategy',
    category: 'puzzle',
    image: '/images/news-3.jpg',
    screenshots: ['/images/news-3.jpg', '/images/hero-banner.png'],
    gameUrl: 'internal',
    playableType: 'cyber-2048',
    rating: 4.9,
    totalRatings: 25,
    plays: 430,
    difficulty: 'easy',
    tags: ['Puzzle', 'Logic', 'Strategy', 'Casual'],
    developer: 'Galactic Squad Studios',
    isFeatured: false,
    isTrending: true,
  },
  {
    title: 'Neon Matrix Snake',
    slug: 'neon-matrix-snake',
    description: 'The retro arcade classic re-engineered with glowing neon aesthetic, quantum power-up items, time-dilation boosts, and high score multipliers.',
    genre: 'Retro Arcade / Neon Classic',
    category: 'arcade',
    image: '/images/news-1.jpg',
    screenshots: ['/images/news-1.jpg', '/images/body-bg.jpg'],
    gameUrl: 'internal',
    playableType: 'neon-snake',
    rating: 4.6,
    totalRatings: 9,
    plays: 180,
    difficulty: 'medium',
    tags: ['Retro', 'Arcade', 'Classic', 'Neon'],
    developer: 'Galactic Squad Studios',
    isFeatured: false,
    isTrending: false,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-website';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding.');

    // Clear existing collections
    await User.deleteMany();
    await Game.deleteMany();
    await Achievement.deleteMany();
    await Score.deleteMany();
    await Review.deleteMany();
    console.log('🧹 Cleared existing database records.');

    // 1. Insert Achievements
    const createdAchievements = await Achievement.insertMany(achievementsData);
    console.log(`🏆 Seeded ${createdAchievements.length} achievements.`);

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const demoPassword = await bcrypt.hash('player123', salt);

    const adminUser = await User.create({
      username: 'GalacticCommander',
      email: 'admin@galacticsquad.com',
      password: adminPassword,
      role: 'admin',
      level: 15,
      xp: 2450,
      streak: 7,
      gamesPlayed: 45,
      totalScore: 58900,
      avatar: '/images/team-logo-1.png',
      bio: 'High Commander of the Galactic Fleet. Builder of games and cosmic worlds.',
      achievements: createdAchievements.map((a) => a._id),
    });

    const playerOne = await User.create({
      username: 'CyberReaper',
      email: 'reaper@galacticsquad.com',
      password: demoPassword,
      role: 'user',
      level: 8,
      xp: 750,
      streak: 4,
      gamesPlayed: 22,
      totalScore: 23400,
      avatar: '/images/team-logo-2.png',
      bio: 'Precision sniper and speedrunner. Top 10 global rank contender.',
      achievements: [createdAchievements[0]._id, createdAchievements[1]._id, createdAchievements[2]._id],
    });

    const playerTwo = await User.create({
      username: 'PhoenixValkyrie',
      email: 'phoenix@galacticsquad.com',
      password: demoPassword,
      role: 'user',
      level: 5,
      xp: 410,
      streak: 2,
      gamesPlayed: 14,
      totalScore: 16800,
      avatar: '/images/team-logo-4.png',
      bio: 'Specialist in planetary defense and real-time tactics.',
      achievements: [createdAchievements[0]._id, createdAchievements[1]._id],
    });

    console.log('👤 Seeded users: GalacticCommander (admin), CyberReaper, PhoenixValkyrie.');

    // 3. Insert Games
    const createdGames = await Game.insertMany(gamesData);
    console.log(`🎮 Seeded ${createdGames.length} games.`);

    // 4. Seed Scores
    await Score.create([
      { user: adminUser._id, game: createdGames[0]._id, score: 7420, duration: 240, completed: true, rank: 1 },
      { user: playerOne._id, game: createdGames[0]._id, score: 5890, duration: 190, completed: true, rank: 2 },
      { user: playerTwo._id, game: createdGames[0]._id, score: 3200, duration: 120, completed: false, rank: 3 },
      { user: playerOne._id, game: createdGames[1]._id, score: 9840, duration: 310, completed: true, rank: 1 },
      { user: adminUser._id, game: createdGames[1]._id, score: 8150, duration: 280, completed: true, rank: 2 },
      { user: adminUser._id, game: createdGames[3]._id, score: 14200, duration: 420, completed: true, rank: 1 },
    ]);
    console.log('📊 Seeded high scores and leaderboard data.');

    // 5. Seed Reviews
    await Review.create([
      {
        user: playerOne._id,
        game: createdGames[0]._id,
        rating: 5,
        title: 'Insanely fun space shooter!',
        comment: 'The bullet physics and responsive laser sound effects are phenomenal. Highly recommended for arcade lovers!',
        pros: ['Responsive controls', 'Awesome explosions', 'Great boss fights'],
        cons: ['Gets quite intense on wave 10+'],
      },
      {
        user: playerTwo._id,
        game: createdGames[0]._id,
        rating: 5,
        title: 'Masterpiece arcade mechanics',
        comment: 'Smooth 60FPS browser performance. The power-ups and shield bursts feel super satisfying.',
        pros: ['Zero lag', 'Glow aesthetics', 'Challenging waves'],
        cons: ['Need more weapon upgrades'],
      },
      {
        user: adminUser._id,
        game: createdGames[1]._id,
        rating: 5,
        title: 'Addictive speed thrills',
        comment: 'Dodging asteroids at lightspeed is pure adrenaline. Perfect game to play on breaks.',
        pros: ['High speed', 'Great particle effects', 'Awesome soundtrack vibes'],
        cons: ['Hard to master at first'],
      },
    ]);
    console.log('⭐ Seeded initial user reviews.');

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
