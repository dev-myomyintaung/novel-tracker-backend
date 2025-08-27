import {prisma} from "../models/prisma-client";
import postsService from "../modules/posts/posts.service";

interface LikePayload {
    postId: number;
    userId: number;
}

const likePost = async ({postId, userId}: LikePayload)=>{
    await postsService.getPostById(postId)

    return prisma.like.create({
        data: {
            post: {
                connect: {
                    id: postId
                }
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })
}

const unlikePost = async ({postId, userId}: LikePayload)=>{
    await postsService.getPostById(postId)

    return prisma.like.delete({
        where: {
            userId_postId: {
                postId: postId,
                userId: userId
            }
        }
    })
}

export default {
    likePost,
    unlikePost,
}
