/*
  Warnings:

  - You are about to drop the `PreviewImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PreviewImage" DROP CONSTRAINT "PreviewImage_bookId_fkey";

-- DropTable
DROP TABLE "PreviewImage";

-- CreateTable
CREATE TABLE "CoverImage" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "CoverImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoverImage_bookId_key" ON "CoverImage"("bookId");

-- AddForeignKey
ALTER TABLE "CoverImage" ADD CONSTRAINT "CoverImage_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
