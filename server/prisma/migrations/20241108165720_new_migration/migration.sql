/*
  Warnings:

  - Added the required column `queueDate` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `queue` ADD COLUMN `queueDate` DATETIME(3) NOT NULL;
