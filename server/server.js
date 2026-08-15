import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

import connectDB from './config/database.js';
import corsOptions from './config/cors.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/error.js';

// Route imports
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import userRoutes from './routes/users.js';
import scoreRoutes from './routes/scores.js';
import reviewRoutes from './routes/reviews.js';
import aiRoutes from './routes/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// Enable CORS
app.use(cors(corsOptions));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to API endpoints
app.use('/api', apiLimiter);

// Serve static uploads / public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: '🚀 Galactic Squad Game Engine API is active and running.',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Catch 404 for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start listening
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🎮 Galactic Squad Game Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

export default app;
