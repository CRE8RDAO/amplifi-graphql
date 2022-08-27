-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "creation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration" DATETIME,
    "userAddress" TEXT NOT NULL,
    CONSTRAINT "Payout_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payout" ("creation", "expiration", "id", "status", "userAddress") SELECT "creation", "expiration", "id", "status", "userAddress" FROM "Payout";
DROP TABLE "Payout";
ALTER TABLE "new_Payout" RENAME TO "Payout";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
