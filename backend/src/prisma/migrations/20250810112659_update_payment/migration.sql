/*
  Warnings:

  - You are about to drop the column `payment_status` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payment_status";

-- DropEnum
DROP TYPE "PaymentStatus";
