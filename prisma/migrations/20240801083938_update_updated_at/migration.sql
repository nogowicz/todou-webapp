/*
  Warnings:

  - You are about to drop the column `photo` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `list` ADD COLUMN `updatedAt` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `subtask` ADD COLUMN `updatedAt` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `updatedAt` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `photo`,
    ADD COLUMN `photoURL` VARCHAR(300) NULL,
    ADD COLUMN `updatedAt` DATETIME(0) NULL;
