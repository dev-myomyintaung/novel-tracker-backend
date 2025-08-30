import { Router } from 'express';
import commentsController from "./comments.controller";
import {validateCreateComment, validateDeleteComment, validateGetCommentsByPost} from "./comments.validator";
const router = Router();

router.post('/', validateCreateComment, commentsController.createComment);
router.get('/post/:postId', validateGetCommentsByPost, commentsController.getCommentsByPost)
router.delete('/:postId', validateDeleteComment, commentsController.deleteComment)

export default router;
