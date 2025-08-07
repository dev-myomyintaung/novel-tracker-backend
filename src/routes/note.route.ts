import express from 'express';
import { createNote, getNotesByNovel, updateNote, deleteNote } from '../controllers/note.controller';
import {
    validateCreateNote,
    validateNoteId,
    validateNovelId,
} from '../middlewares/validator/note.validator';

const router = express.Router();

router.get('/novel/:novelId', validateNovelId, getNotesByNovel);
router.post('/', validateCreateNote, createNote);

export default router;
