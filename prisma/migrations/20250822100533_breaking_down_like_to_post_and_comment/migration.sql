/*
  Warnings:

  - You are about to drop the column `comment_id` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `likes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_fkey";

-- DropIndex
DROP INDEX "likes_user_id_comment_id_key";

-- DropIndex
DROP INDEX "likes_user_id_post_id_key";
     -- DropTable
Drop Table "likes";

-- CreateTable
CREATE TABLE "commentLikes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "commentLikes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "postLikes" (
                                "id" SERIAL NOT NULL,
                                "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "userId" INTEGER NOT NULL,
                                "postId" INTEGER NOT NULL,

                                CONSTRAINT "postLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commentLikes_userId_commentId_key" ON "commentLikes"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "postLikes"("userId", "postId");

-- AddForeignKey
ALTER TABLE "postLikes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postLikes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentLikes" ADD CONSTRAINT "commentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentLikes" ADD CONSTRAINT "commentLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
