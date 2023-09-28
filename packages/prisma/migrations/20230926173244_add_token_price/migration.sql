-- CreateTable
CREATE TABLE "TokenPrice" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 1,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenPrice" ADD CONSTRAINT "TokenPrice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
