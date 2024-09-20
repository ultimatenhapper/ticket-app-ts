/*
  Warnings:

  - A unique constraint covering the columns `[ticketId]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticketId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "ticketId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Todo_ticketId_key" ON "Todo"("ticketId");
