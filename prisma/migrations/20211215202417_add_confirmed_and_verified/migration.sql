-- AlterTable
ALTER TABLE `users` ADD COLUMN `confirmed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false;
