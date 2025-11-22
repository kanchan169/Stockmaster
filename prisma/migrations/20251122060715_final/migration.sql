/*
  Warnings:

  - You are about to drop the column `amount` on the `Adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Adjustment` table. All the data in the column will be lost.
  - Added the required column `newQty` to the `Adjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldQty` to the `Adjustment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN "customer" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "category" TEXT;
ALTER TABLE "Product" ADD COLUMN "unit" TEXT;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN "supplier" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adjustment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "oldQty" INTEGER NOT NULL,
    "newQty" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Adjustment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Adjustment" ("createdAt", "id", "productId") SELECT "createdAt", "id", "productId" FROM "Adjustment";
DROP TABLE "Adjustment";
ALTER TABLE "new_Adjustment" RENAME TO "Adjustment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
