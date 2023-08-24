/*
  Warnings:

  - You are about to drop the `TokenPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TokenPrice" DROP CONSTRAINT "TokenPrice_emitterId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "amountsMintedPerMonth" INTEGER NOT NULL DEFAULT 3000,
ADD COLUMN     "price" INTEGER[] DEFAULT ARRAY[1]::INTEGER[];

-- DropTable
DROP TABLE "TokenPrice";
