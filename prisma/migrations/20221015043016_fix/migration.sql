/*
  Warnings:

  - You are about to drop the `teste` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "teste";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Teste" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "banner" TEXT NOT NULL
);
