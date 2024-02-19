/*
  Warnings:

  - You are about to drop the column `is_teacher` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_teacher",
ALTER COLUMN "section" SET DEFAULT 1;

-- CreateIndex
CREATE INDEX "users_class_id_idx" ON "users"("class_id");
