-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('FREEMIUM', 'LEVEL1', 'LEVEL2', 'LEVEL3');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "level" "UserLevel" NOT NULL DEFAULT 'FREEMIUM';
