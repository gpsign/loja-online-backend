/*
  Warnings:

  - You are about to drop the column `stock_threshold_override` on the `product_configs` table. All the data in the column will be lost.
  - You are about to drop the column `is_stock_infinite` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_configs" DROP COLUMN "stock_threshold_override",
ADD COLUMN     "is_stock_infinite" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "is_stock_infinite";
