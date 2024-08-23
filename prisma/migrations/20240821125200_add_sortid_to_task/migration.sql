/*
  Warnings:

  - You are about to alter the column `addedBy` on the `subtask` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `sortId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subtask" (
    "subtaskId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN DEFAULT false,
    "addedBy" INTEGER NOT NULL,
    "createdAt" DATETIME,
    "updatedAt" DATETIME,
    CONSTRAINT "subtask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task" ("taskId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subtask" ("addedBy", "createdAt", "isCompleted", "subtaskId", "taskId", "title", "updatedAt") SELECT "addedBy", "createdAt", "isCompleted", "subtaskId", "taskId", "title", "updatedAt" FROM "subtask";
DROP TABLE "subtask";
ALTER TABLE "new_subtask" RENAME TO "subtask";
CREATE INDEX "subtask_taskId_idx" ON "subtask"("taskId");
CREATE TABLE "new_task" (
    "taskId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "listId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN DEFAULT false,
    "deadline" DATETIME,
    "importance" TEXT DEFAULT 'Not important',
    "urgency" TEXT DEFAULT 'Not urgent',
    "note" TEXT,
    "addedBy" INTEGER NOT NULL,
    "assignedTo" INTEGER NOT NULL,
    "createdAt" DATETIME,
    "updatedAt" DATETIME,
    "notificationTime" DATETIME,
    "sortId" INTEGER NOT NULL,
    CONSTRAINT "task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_task" ("addedBy", "assignedTo", "createdAt", "deadline", "importance", "isCompleted", "listId", "note", "notificationTime", "taskId", "title", "updatedAt", "urgency") SELECT "addedBy", "assignedTo", "createdAt", "deadline", "importance", "isCompleted", "listId", "note", "notificationTime", "taskId", "title", "updatedAt", "urgency" FROM "task";
DROP TABLE "task";
ALTER TABLE "new_task" RENAME TO "task";
CREATE INDEX "task_listId_idx" ON "task"("listId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
