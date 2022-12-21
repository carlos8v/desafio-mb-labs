/*
  Warnings:

  - Added the required column `fee` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "ticketPrice" DECIMAL(65,30) NOT NULL;
