-- CreateTable
CREATE TABLE "TimeTokensWallet" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "emitterId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "TimeTokensWallet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeTokensWallet" ADD CONSTRAINT "TimeTokensWallet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTokensWallet" ADD CONSTRAINT "TimeTokensWallet_emitterId_fkey" FOREIGN KEY ("emitterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
