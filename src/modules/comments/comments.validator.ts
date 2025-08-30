import {validate} from "../../middlewares/validator/validate";
import {body, param} from "express-validator";

export const validateCreateComment = validate([
    body('content')
        .notEmpty().withMessage('Content is required')
        .isString().withMessage('Content must be a string'),
    body('postId')
        .isInt().withMessage('Invalid post ID')
]);

export const validateGetCommentsByPost = validate([
    param('postId').isInt().withMessage('Post ID is required'),
])

export const validateDeleteComment = validate([
    param('commentId').isInt().withMessage('Post ID is required'),
])