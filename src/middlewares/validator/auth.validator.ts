import {body} from "express-validator";
import {validate} from "./validate";

export const validateRegisterUser = validate([
        body("email").isEmail().withMessage("Must be a valid email"),
        body("firstName").not().isEmpty().withMessage("First name cannot be empty"),
        body("lastName").not().isEmpty().withMessage("Last name cannot be empty"),
        body("password")
            .isLength({min: 4})
            .withMessage("Password must be at least 4 characters")
])

export const validateLoginUser = [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password")
        .isLength({min: 4})
        .withMessage("Password must be at least 4 characters")
]
