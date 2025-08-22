-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_comment_id_fkey";

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "comment_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "is_published" DROP NOT NULL,
ALTER COLUMN "is_published" SET DEFAULT true;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
