/*
  Warnings:

  - You are about to alter the column `TTS` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "TTS" SET DEFAULT 0,
ALTER COLUMN "TTS" SET DATA TYPE BIGINT;
