import {validate} from "./validate";
import {body, param} from "express-validator";

export const validateCreatePost = validate([
    body('content')
        .isString().withMessage('content must be a string'),
    body('imageUrls').optional().isArray().withMessage('imageUrls must be an array'),
    body('imageUrls.*').optional().isString().withMessage('imageUrls must be an array of strings'),
    body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
]);

export const validateUpdatePost = validate([
    param('id').isInt().withMessage('Invalid post ID'),
    body('content')
        .optional()
        .isString().withMessage('content must be a string'),
    body('imageUrls').optional().isArray().withMessage('imageUrls must be an array'),
    body('imageUrls.*').optional().isString().withMessage('imageUrls must be an array of strings'),
    body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
]);

