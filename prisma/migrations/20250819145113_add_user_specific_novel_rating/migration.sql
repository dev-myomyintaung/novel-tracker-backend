/*
  Warnings:

  - You are about to drop the column `rating` on the `novels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "novels" DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "rating" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "novel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rating_novel_id_idx" ON "rating"("novel_id");

-- CreateIndex
CREATE UNIQUE INDEX "rating_user_id_novel_id_key" ON "rating"("user_id", "novel_id");

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "novels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
