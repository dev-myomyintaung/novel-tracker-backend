import express from "express";
import {
  getNovels,
  createNovel,
  updateNovel,
  deleteNovel,
  getNovelById,
} from "../controllers/novel.controller";
import {
  validateCreateNovel,
  validateNovelId,
  validateUpdateNovel,
} from "../middlewares/validator/novel.validator";
import {
  validateCreateNote,
  validateDeleteNote,
  validateUpdateNote,
} from "../middlewares/validator/note.validator";
import {
  getNotesByNovel,
  updateNote,
  getNovelNoteByNoteId,
  deleteNote,
  createNote,
} from "../controllers/note.controller";

const router = express.Router();

router.post("/", validateCreateNovel, createNovel);
router.post("/:novelId/notes", validateCreateNote, createNote);

router.get("/", getNovels);
router.get("/:novelId/notes/:noteId", validateUpdateNote, getNovelNoteByNoteId);
router.get("/:id/notes", validateNovelId, getNotesByNovel);
router.get("/:id", validateNovelId, getNovelById);

router.patch("/:novelId/notes/:noteId", validateUpdateNote, updateNote);
router.patch("/:id", validateUpdateNovel, updateNovel);

router.delete("/:novelId/notes/:noteId", validateDeleteNote, deleteNote);
router.delete("/:id", validateNovelId, deleteNovel);

export default router;
