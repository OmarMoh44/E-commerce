/*
  Warnings:

  - You are about to drop the column `promotion_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Conversion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchQuery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackingEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_promotion_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_order_id_fkey";

-- DropForeignKey
ALTER TABLE "TrackingEvent" DROP CONSTRAINT "TrackingEvent_shipping_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "promotion_id";

-- DropTable
DROP TABLE "Conversion";

-- DropTable
DROP TABLE "PageView";

-- DropTable
DROP TABLE "ProductImage";

-- DropTable
DROP TABLE "ProductView";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "SearchQuery";

-- DropTable
DROP TABLE "Shipping";

-- DropTable
DROP TABLE "TrackingEvent";

-- DropEnum
DROP TYPE "PromotionStatus";

-- DropEnum
DROP TYPE "PromotionType";

-- DropEnum
DROP TYPE "ShippingMethod";

-- DropEnum
DROP TYPE "ShippingStatus";
