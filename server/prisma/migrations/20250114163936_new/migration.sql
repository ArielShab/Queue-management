/*
  Warnings:

  - A unique constraint covering the columns `[clientEmail]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Client_clientEmail_key` ON `Client`(`clientEmail`);
