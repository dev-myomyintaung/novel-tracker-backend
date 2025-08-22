/*
  Warnings:

  - You are about to drop the `commentLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "commentLikes" DROP CONSTRAINT "commentLikes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "commentLikes" DROP CONSTRAINT "commentLikes_userId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropTable
DROP TABLE "commentLikes";

-- DropTable
DROP TABLE "likes";
