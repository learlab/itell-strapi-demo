/*
  Warnings:

  - You are about to drop the column `chapter` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `is_teacher` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `users` table. All the data in the column will be lost.
  - Added the required column `class_id` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_teacherId_fkey";

-- DropIndex
DROP INDEX "teachers_email_key";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "chapter",
DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "module",
DROP COLUMN "section",
DROP COLUMN "token",
DROP COLUMN "updated_at",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_teacher",
DROP COLUMN "teacherId",
ADD COLUMN     "class_id" TEXT,
ADD COLUMN     "isTeacher" BOOLEAN NOT NULL DEFAULT false;
