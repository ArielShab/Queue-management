/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `queue` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `queue` table. All the data in the column will be lost.
  - You are about to drop the column `codeExpiration` on the `queue` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `queue` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `queue` DROP COLUMN `clientEmail`,
    DROP COLUMN `clientName`,
    DROP COLUMN `codeExpiration`,
    DROP COLUMN `verificationCode`,
    ADD COLUMN `clientId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientName` VARCHAR(191) NOT NULL,
    `clientEmail` VARCHAR(191) NOT NULL,
    `verificationCode` VARCHAR(191) NULL,
    `codeExpiration` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Queue` ADD CONSTRAINT `Queue_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
