-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_list" (
    "listId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listName" TEXT NOT NULL,
    "iconId" INTEGER NOT NULL DEFAULT 0,
    "canBeDeleted" BOOLEAN DEFAULT true,
    "isShared" BOOLEAN DEFAULT false,
    "createdAt" DATETIME,
    "updatedAt" DATETIME,
    "isFavorite" BOOLEAN DEFAULT false,
    "isArchived" BOOLEAN DEFAULT false,
    "createdBy" INTEGER DEFAULT -1,
    "colorVariant" INTEGER NOT NULL DEFAULT 0,
    "sortingType" TEXT NOT NULL DEFAULT 'own'
);
INSERT INTO "new_list" ("canBeDeleted", "colorVariant", "createdAt", "createdBy", "iconId", "isArchived", "isFavorite", "isShared", "listId", "listName", "updatedAt") SELECT "canBeDeleted", "colorVariant", "createdAt", "createdBy", "iconId", "isArchived", "isFavorite", "isShared", "listId", "listName", "updatedAt" FROM "list";
DROP TABLE "list";
ALTER TABLE "new_list" RENAME TO "list";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
