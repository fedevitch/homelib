-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isbn" TEXT,
ADD COLUMN     "isbn10" TEXT,
ADD COLUMN     "isbn13" TEXT;

-- CreateTable
CREATE TABLE "PreviewImage" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "PreviewImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeInfo" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "publisher" TEXT NOT NULL,
    "publishedDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industryIdentifiers" JSONB[],
    "pageCount" TEXT NOT NULL,
    "categories" TEXT[],
    "maturityRating" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "VolumeInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreviewImage_bookId_key" ON "PreviewImage"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "VolumeInfo_bookId_key" ON "VolumeInfo"("bookId");

-- AddForeignKey
ALTER TABLE "PreviewImage" ADD CONSTRAINT "PreviewImage_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeInfo" ADD CONSTRAINT "VolumeInfo_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
