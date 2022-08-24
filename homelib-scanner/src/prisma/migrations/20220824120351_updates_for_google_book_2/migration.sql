/*
  Warnings:

  - You are about to drop the column `json` on the `VolumeInfo` table. All the data in the column will be lost.
  - The `pageCount` column on the `VolumeInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `jsonDump` to the `VolumeInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VolumeInfo" DROP COLUMN "json",
ADD COLUMN     "jsonDump" JSONB NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "publisher" DROP NOT NULL,
ALTER COLUMN "publishedDate" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "pageCount",
ADD COLUMN     "pageCount" INTEGER,
ALTER COLUMN "maturityRating" DROP NOT NULL,
ALTER COLUMN "language" DROP NOT NULL;
