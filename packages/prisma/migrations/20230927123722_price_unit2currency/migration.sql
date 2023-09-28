/*
  Warnings:

  - You are about to drop the column `priceUnit` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TokenPrice" ALTER COLUMN "price" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "priceUnit",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd',
ALTER COLUMN "price" DROP DEFAULT;
