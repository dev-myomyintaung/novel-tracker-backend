import {prisma} from "../../models/prisma-client";

interface CommentPayload {
    authorId: number;
    postId: number;
    content: string;
}

const createComment = ({content, authorId, postId}: CommentPayload) => {
    return prisma.comment.create({
        data: {
            author: {
                connect: {
                    id: authorId
                }
            },
            content,
            post: {
                connect: {
                    id: postId
                }
            },

        }
    })
};

const getCommentsByPost = (postId: number) => {
    return prisma.comment.findMany({
        where: {
            postId: postId,
        }
    })
}

const deleteComment = (id: number) => {
    return prisma.comment.delete({
        where: {
            id: id
        }
    })
}

export default {
    createComment,
    getCommentsByPost,
    deleteComment
};
