import { Router } from 'express';
import postsController from "./posts.controller";
import {validateGetPostById} from "./posts.validator";
import {validateCreatePost, validateUpdatePost} from "../../middlewares/validator/post.validator";

const router = Router();

router.get('/:id', validateGetPostById, postsController.getPostById);
router.post('/', validateCreatePost, postsController.createPost);
router.patch('/:id', validateUpdatePost, postsController.updatePost);

export default router;
