import {NotFound} from "http-errors";
import {prisma} from "../../models/prisma-client";

interface PostPayload {
    authorId: number;
    content?: string;
    imageUrls?: string[];
    isPublished?: boolean;
}

async function createPost(payload: PostPayload) {
    return prisma.post.create({
        data: {
            author: {
                connect: {
                    id: payload.authorId
                }
            },
            content: payload.content,
            imageUrls: payload.imageUrls,
            isPublished: payload.isPublished,
        }
    });
}

async function getPostById(id?: number) {
    const post = await prisma.post.findUnique({
        where: {
            id
        },
        include: {
            comments: true
        }
    });

    if(!post){
        throw new NotFound("Post not found")
    }

    return post;
}

async function updatePost(id: number | undefined, payload: Partial<PostPayload>) {
    await getPostById(id);
    return prisma.post.update({
        where: {
            id
        },
        data: {
            content: payload.content,
            imageUrls: payload.imageUrls,
            isPublished: payload.isPublished,
        }
    })
}

export default {
    createPost,
    updatePost,
    getPostById,
};
