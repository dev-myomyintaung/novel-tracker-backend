import {validate} from "./validate";
import {body, param} from "express-validator";

export const validateLike = validate([
    body('postId')
        .isInt().withMessage('post id must be a number'),
]);

