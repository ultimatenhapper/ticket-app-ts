-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('PENDING', 'DONE');

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "dueDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "dueDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TodoStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TodoToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TodoToUser_AB_unique" ON "_TodoToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TodoToUser_B_index" ON "_TodoToUser"("B");
