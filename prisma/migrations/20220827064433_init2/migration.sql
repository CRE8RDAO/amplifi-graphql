/*
  Warnings:

  - The primary key for the `Referrer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Referrer` table. All the data in the column will be lost.
  - You are about to drop the column `referrerId` on the `Referee` table. All the data in the column will be lost.
  - Added the required column `referrerAddress` to the `Referee` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Referrer" (
    "address" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Referrer_address_fkey" FOREIGN KEY ("address") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Referrer" ("address") SELECT "address" FROM "Referrer";
DROP TABLE "Referrer";
ALTER TABLE "new_Referrer" RENAME TO "Referrer";
CREATE TABLE "new_Referee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "referrerAddress" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Referee_address_fkey" FOREIGN KEY ("address") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Referee_referrerAddress_fkey" FOREIGN KEY ("referrerAddress") REFERENCES "Referrer" ("address") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Referee_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Referee" ("address", "campaignId", "id") SELECT "address", "campaignId", "id" FROM "Referee";
DROP TABLE "Referee";
ALTER TABLE "new_Referee" RENAME TO "Referee";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
