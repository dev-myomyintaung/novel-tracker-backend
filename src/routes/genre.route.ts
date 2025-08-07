import express from "express";
import {
  createGenre,
  getGenres,
  updateGenre,
  deleteGenre,
  getGenreById,
} from "../controllers/genre.controller";
import {
  validateCreateGenre,
  validateGenreId,
  validateUpdateGenre,
} from "../middlewares/validator/genre.validator";
import { requireAdmin } from "../middlewares/require-admin";

const router = express.Router();

router.get("/", getGenres);
router.post("/", requireAdmin, validateCreateGenre, createGenre);
router.get("/:id", validateGenreId, getGenreById);
router.patch("/:id", requireAdmin, validateUpdateGenre, updateGenre);
router.delete("/:id", requireAdmin, validateGenreId, deleteGenre);

export default router;
