/*
  Warnings:

  - You are about to drop the `BrandType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_BrandTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_InventoryTypeId_fkey`;

-- DropTable
DROP TABLE `BrandType`;

-- DropTable
DROP TABLE `Inventory`;

-- DropTable
DROP TABLE `InventoryType`;
