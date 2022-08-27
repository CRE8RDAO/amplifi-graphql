-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "twitterHandle" TEXT,
    "discordHandle" TEXT
);

-- CreateTable
CREATE TABLE "Referrer" (
    "address" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "Referrer_address_fkey" FOREIGN KEY ("address") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Referee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "referrerAddress" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Referee_address_fkey" FOREIGN KEY ("address") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Referee_referrerAddress_fkey" FOREIGN KEY ("referrerAddress") REFERENCES "Referrer" ("address") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Referee_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "social" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CompletedAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "refereeId" TEXT NOT NULL,
    "allowedActionId" TEXT NOT NULL,
    CONSTRAINT "CompletedAction_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Referee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompletedAction_allowedActionId_fkey" FOREIGN KEY ("allowedActionId") REFERENCES "AllowedAction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AllowedAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "AllowedAction_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "creation" DATETIME NOT NULL,
    "expiration" DATETIME,
    "userAddress" TEXT NOT NULL,
    CONSTRAINT "Payout_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayoutToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payoutId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "amountUSD" DECIMAL,
    "amountNum" TEXT,
    CONSTRAINT "PayoutToken_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "Payout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PayoutToken_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");
