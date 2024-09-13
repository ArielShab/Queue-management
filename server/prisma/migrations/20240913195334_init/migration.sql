/*
  Warnings:

  - You are about to drop the column `tempCode` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `tempCode`,
    ADD COLUMN `codeExpiration` DATETIME(3) NULL,
    ADD COLUMN `verificationCode` VARCHAR(191) NULL;
