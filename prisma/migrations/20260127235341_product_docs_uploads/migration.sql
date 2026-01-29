/*
  Warnings:

  - Added the required column `fileName` to the `ProductDoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `ProductDoc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `ProductDoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductDoc" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
