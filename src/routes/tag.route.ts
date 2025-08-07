import express from 'express';
import {createTag, getTags, updateTag, deleteTag, getTagById} from '../controllers/tag.controller';
import {validateCreateTag, validateTagId, validateUpdateTag} from '../middlewares/validator/tag.validator';

const router = express.Router();

router.get('/', getTags);
router.post('/', validateCreateTag, createTag);
router.get('/:id', validateTagId, getTagById);
router.patch('/:id', validateUpdateTag, updateTag);
router.delete('/:id', validateTagId, deleteTag);

export default router;
