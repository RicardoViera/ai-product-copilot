-- Cretae vector
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "ProductDocChunk" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductDocChunk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductDocChunk" ADD CONSTRAINT "ProductDocChunk_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDocChunk" ADD CONSTRAINT "ProductDocChunk_docId_fkey" FOREIGN KEY ("docId") REFERENCES "ProductDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
