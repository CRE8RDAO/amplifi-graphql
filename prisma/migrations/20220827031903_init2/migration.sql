/*
  Warnings:

  - Added the required column `slug` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Campaign" ("id") SELECT "id" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
