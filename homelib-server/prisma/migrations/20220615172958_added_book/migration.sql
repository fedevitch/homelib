-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "createdOnDisk" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_fullName_key" ON "Book"("fullName");
