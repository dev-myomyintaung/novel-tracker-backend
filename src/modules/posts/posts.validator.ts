import {validate} from "../../middlewares/validator/validate";
import {body, param} from "express-validator";

export const validateGetPostById = validate([
    param('id')
        .isInt().withMessage('Invalid post ID')
]);
