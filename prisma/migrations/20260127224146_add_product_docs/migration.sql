-- CreateTable
CREATE TABLE "ProductDoc" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductDoc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductDoc" ADD CONSTRAINT "ProductDoc_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
