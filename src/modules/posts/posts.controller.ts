import {Request, Response, NextFunction} from "express";
import postsService from "./posts.service";

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {user} = req;
        const {id} = req.params;
        const post = await postsService.getPostById(+id!)
        res.json({
            data: post
        })
    } catch (err) {
        next(err)
    }
}


async function createPost(req: Request, res: Response, next: NextFunction){
    try {
        const {user} = req;
        const {content, imageUrls, isPublished} = req.body;
        const post = await postsService.createPost({
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
        const post = await postsService.updatePost(+id, {
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
    getPostById,
    createPost,
    updatePost
}
