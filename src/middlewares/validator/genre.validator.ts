
import { body, param } from 'express-validator';
import { validate } from './validate';

export const validateCreateGenre = validate([
    body('genreName')
        .notEmpty().withMessage('Genre name is required')
        .isString().withMessage('Genre name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Genre name must be 2–50 characters'),
]);

export const validateUpdateGenre = validate([
    param('id').isInt().withMessage('Invalid genre ID'),
    body('genreName')
        .optional()
        .isString().withMessage('Genre name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Genre name must be 2–50 characters'),
]);

export const validateGenreId = validate([
    param('id').isInt().withMessage('Invalid genre ID'),
]);
