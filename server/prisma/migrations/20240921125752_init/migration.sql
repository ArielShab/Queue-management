/*
  Warnings:

  - A unique constraint covering the columns `[clientEmail]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `queueDuration` INTEGER NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE `WorkingTimes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `opening` VARCHAR(191) NOT NULL DEFAULT '8:00',
    `closing` VARCHAR(191) NOT NULL DEFAULT '20:00',

    UNIQUE INDEX `WorkingTimes_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Queue_clientEmail_key` ON `Queue`(`clientEmail`);

-- AddForeignKey
ALTER TABLE `WorkingTimes` ADD CONSTRAINT `WorkingTimes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
