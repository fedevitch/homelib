/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book_id_key" ON "Book"("id");

-- CreateIndex
CREATE INDEX "Book_name_idx" ON "Book" USING SPGIST ("name");

-- CreateIndex
CREATE INDEX "Book_summary_idx" ON "Book" USING SPGIST ("summary");

-- CreateIndex
CREATE INDEX "Book_isbn_idx" ON "Book" USING SPGIST ("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
