/*
  Warnings:

  - Made the column `lastRewardedDate` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "lastRewardedDate" SET NOT NULL,
ALTER COLUMN "lastRewardedDate" SET DEFAULT CURRENT_TIMESTAMP;
