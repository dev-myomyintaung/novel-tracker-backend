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

export default {
    createComment
}
