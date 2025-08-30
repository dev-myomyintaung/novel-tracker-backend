import {Request, Response, NextFunction} from 'express';
import commentsService from "./comments.service";

const createComment = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const {user} = req;
        const {postId, content} = req.body;
        const comment = await commentsService.createComment({
            postId,
            content,
            authorId: user?.id!
        })
        res.status(201).json({
            data: comment
        })
    } catch (e) {
        next(e)
    }
}

const getCommentsByPost = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const {postId} = req.params;
        const comments = await commentsService.getCommentsByPost(+postId!);
        res.status(200).json({
            data: comments
        })
    } catch (e) {
        next(e)
    }
}

const deleteComment = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const {commentId} = req.params;
        await commentsService.deleteComment(+commentId!);
        res.status(201).json({})
    } catch (e) {
        next(e)
    }
}

export default {
    createComment,
    getCommentsByPost,
    deleteComment
}
