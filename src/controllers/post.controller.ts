import {Response, Request, NextFunction} from 'express';
import postService from "../services/post.service";

async function createPost(req: Request, res: Response, next: NextFunction){
    try {
        const {user} = req;
        const {content, imageUrls, isPublished} = req.body;
        const post = await postService.createPost({
            authorId: user?.id!,
            content,
            imageUrls,
            isPublished: isPublished ?? true
        })
        res.status(201).json({
            message: 'Post created successfully',
            data: post
        })
    } catch (err) {
        next(err)
    }
}

async function updatePost(req: Request, res: Response, next: NextFunction){
    try {
        const {user} = req;
        const {id} = req.params;
        const {content, imageUrls, isPublished} = req.body;
        const post = await postService.updatePost(+id, {
            content,
            imageUrls,
            isPublished
        })

        res.status(200).json({
            message: 'Post updated successfully',
            data: post
        })
    }catch (err) {
        next(err)
    }
}

export default {
    createPost,
    updatePost
};
