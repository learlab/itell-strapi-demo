/*
  Warnings:

  - Made the column `chapter` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `section` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "chapter" SET NOT NULL,
ALTER COLUMN "section" SET NOT NULL;
