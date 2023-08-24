-- AlterTable
ALTER TABLE "TokenPrice" ALTER COLUMN "price" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 0;
