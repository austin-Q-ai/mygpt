/*
  Warnings:

  - You are about to drop the column `externalId` on the `TimeTokensWallet` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `TimeTokensWallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "walletId" INTEGER,
ALTER COLUMN "bookingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "brandColor" SET DEFAULT '#6d278e';

-- AlterTable
ALTER TABLE "TimeTokensWallet" DROP COLUMN "externalId",
DROP COLUMN "paid";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "brandColor" SET DEFAULT '#6d278e';

-- CreateTable
CREATE TABLE "TimeTokensTransaction" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "emitterId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TimeTokensTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeTokensTransaction" ADD CONSTRAINT "TimeTokensTransaction_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTokensTransaction" ADD CONSTRAINT "TimeTokensTransaction_emitterId_fkey" FOREIGN KEY ("emitterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "TimeTokensTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
