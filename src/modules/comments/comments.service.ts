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

export default {
    createComment,
};
