import likeService from "../services/like.service";
import { Request, Response, NextFunction } from "express";

const likePost = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const {user} = req;
        const {postId} = req.body;
        const like = await likeService.likePost({
            postId,
            userId: user?.id!
        });
        res.json({
            data: like
        });
    } catch (err) {
        next(err);
    }
}


const unLikePost = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const {user} = req;
        const {postId} = req.body;
        const like = await likeService.unlikePost({
            postId,
            userId: user?.id!
        });
        res.json({
            data: like
        });
    } catch (err) {
        next(err);
    }
}

export default {
    likePost,
    unLikePost
}
