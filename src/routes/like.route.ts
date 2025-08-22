import express from 'express';
import {validateLike} from "../middlewares/validator/like.validator";
import likeController from "../controllers/like.controller";
const router = express.Router();

router.post('/post/like', validateLike, likeController.likePost)
router.post('/post/unlike', validateLike, likeController.unLikePost)

export default router;
