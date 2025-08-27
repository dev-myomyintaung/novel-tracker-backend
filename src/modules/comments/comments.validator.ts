import {validate} from "../../middlewares/validator/validate";
import {body} from "express-validator";

export const validateCreateComment = validate([
    body('content')
        .notEmpty().withMessage('Content is required')
        .isString().withMessage('Content must be a string'),
    body('postId')
        .isInt().withMessage('Invalid post ID')
]);
