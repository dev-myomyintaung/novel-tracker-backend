import { body, param } from 'express-validator';
import { validate } from './validate';

export const validateCreateNovel = validate([
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['READING', 'COMPLETED', 'WISHLIST', 'DROPPED']).withMessage('Invalid status'),
]);

export const validateUpdateNovel = validate([
    param('id').isInt().withMessage('Invalid novel ID'),
    body('title')
        .optional()
        .isString().withMessage('Title must be a string'),
    body('status')
        .optional()
        .isIn(['READING', 'COMPLETED', 'WISHLIST', 'DROPPED']).withMessage('Invalid status, must be one of READING, COMPLETED, WISHLIST, DROPPED'),
]);

export const validateNovelId = validate([
    param('id').isInt().withMessage('Invalid novel ID'),
]);
