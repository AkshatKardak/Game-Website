import { body } from 'express-validator';
import validate from '../middleware/validation.js';

export const updateProfileValidation = [
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('avatar').optional().isString().withMessage('Avatar must be a valid image path/URL'),
  validate,
];
