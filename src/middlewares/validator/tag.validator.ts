import { body, param } from 'express-validator';
import { validate } from './validate';

export const validateCreateTag = validate([
    body('tagName')
        .notEmpty().withMessage('Tag name is required')
        .isString().withMessage('Tag name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Tag name must be 2–50 characters'),
]);

export const validateUpdateTag = validate([
    param('id').isInt().withMessage('Invalid tag ID'),
    body('tagName')
        .optional()
        .isString().withMessage('Tag name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Tag name must be 2–50 characters'),
]);

export const validateTagId = validate([
    param('id').isInt().withMessage('Invalid tag ID'),
]);
