import { body } from 'express-validator';
import validate from '../middleware/validation.js';

export const createGameValidation = [
  body('title').trim().notEmpty().withMessage('Game title is required'),
  body('description').trim().notEmpty().withMessage('Game description is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  validate,
];

export const updateGameValidation = [
  body('title').optional().trim().notEmpty().withMessage('Game title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Game description cannot be empty'),
  validate,
];
