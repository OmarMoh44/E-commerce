/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "transaction_id",
ALTER COLUMN "paid_at" SET DEFAULT CURRENT_TIMESTAMP;
