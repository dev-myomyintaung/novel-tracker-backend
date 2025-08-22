import express from "express";
import postController from "../controllers/post.controller";
import {validateCreatePost, validateUpdatePost} from "../middlewares/validator/post.validator";
const router = express.Router();

router.post('/', validateCreatePost, postController.createPost);
router.patch('/:id', validateUpdatePost, postController.updatePost);

export default router;
