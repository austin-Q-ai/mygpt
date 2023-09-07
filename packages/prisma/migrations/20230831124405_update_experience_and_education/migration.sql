/*
  Warnings:

  - You are about to drop the column `endDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endMonth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "endYear" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "startMonth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "startYear" INTEGER NOT NULL DEFAULT 2000;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endMonth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "endYear" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "startMonth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "startYear" INTEGER NOT NULL DEFAULT 2000;
