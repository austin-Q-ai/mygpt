-- AlterTable
ALTER TABLE "TimeTokensWallet" ADD COLUMN     "externalId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;
