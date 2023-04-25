/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shops` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Shops` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shopsId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `Users_role_fkey`;

-- AlterTable
ALTER TABLE `Shops` DROP COLUMN `createdAt`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `updatedBy`;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `shopsId` VARCHAR(40) NOT NULL,
    MODIFY `role` VARCHAR(40) NOT NULL;

-- DropTable
DROP TABLE `Payments`;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_shopsId_fkey` FOREIGN KEY (`shopsId`) REFERENCES `Shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_role_fkey` FOREIGN KEY (`role`) REFERENCES `Groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
