import { Router } from 'express';
import commentsController from "./comments.controller";
import {validateCreateComment} from "./comments.validator";
const router = Router();

router.post('/', validateCreateComment, commentsController.createComment);

export default router;
