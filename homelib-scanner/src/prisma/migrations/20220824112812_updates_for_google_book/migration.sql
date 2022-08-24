/*
  Warnings:

  - Added the required column `json` to the `VolumeInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VolumeInfo" ADD COLUMN     "json" JSONB NOT NULL,
ADD COLUMN     "previewLinks" TEXT[];
