import { body, param } from "express-validator";
import { validate } from "./validate";

export const validateCreateNote = validate([
  body("novelId").isInt().withMessage("Novel ID is required"),
  body("content")
    .isString()
    .withMessage("Note content must be a string")
    .isLength({ max: 1000 })
    .withMessage("Note content must not exceed 1000 characters"),
]);

export const validateUpdateNote = validate([
  param("novelId").isInt().withMessage("Invalid novel ID"),
  param("noteId").isInt().withMessage("Invalid note ID"),
  body("content")
    .optional()
    .isString()
    .withMessage("Note content must be a string")
    .isLength({ max: 1000 })
    .withMessage("Note content must not exceed 1000 characters"),
]);

export const validateDeleteNote = validate([
  param("novelId").isInt().withMessage("Invalid novel ID"),
  param("noteId").isInt().withMessage("Invalid note ID"),
]);

export const validateNoteId = validate([
  param("id").isInt().withMessage("Invalid note ID"),
]);

export const validateNovelId = validate([
  param("id").isInt().withMessage("Invalid novel ID"),
]);
