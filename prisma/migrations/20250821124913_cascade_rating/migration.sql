-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_novel_id_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_user_id_fkey";

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "novels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
