/*
  Warnings:

  - You are about to alter the column `numReviews` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - Changed the type of `stock` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock",
ADD COLUMN     "stock" INTEGER NOT NULL,
ALTER COLUMN "numReviews" SET DEFAULT 0,
ALTER COLUMN "numReviews" SET DATA TYPE INTEGER;
