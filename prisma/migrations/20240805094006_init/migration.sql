-- CreateTable
CREATE TABLE "invitation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "listId" INTEGER NOT NULL,
    "inviterId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME,
    CONSTRAINT "invitation_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "list" (
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
    "colorVariant" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "subtask" (
    "subtaskId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN DEFAULT false,
    "addedBy" TEXT NOT NULL,
    "createdAt" DATETIME,
    "updatedAt" DATETIME,
    CONSTRAINT "subtask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task" ("taskId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task" (
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
    CONSTRAINT "task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photoURL" TEXT,
    "idDefaultList" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "user_idDefaultList_fkey" FOREIGN KEY ("idDefaultList") REFERENCES "list" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "userlist" (
    "listId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("listId", "userId"),
    CONSTRAINT "userlist_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "userlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_code_key" ON "invitation"("code");

-- CreateIndex
CREATE INDEX "invitation_inviterId_idx" ON "invitation"("inviterId");

-- CreateIndex
CREATE INDEX "invitation_listId_idx" ON "invitation"("listId");

-- CreateIndex
CREATE INDEX "subtask_taskId_idx" ON "subtask"("taskId");

-- CreateIndex
CREATE INDEX "task_listId_idx" ON "task"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_idDefaultList_idx" ON "user"("idDefaultList");

-- CreateIndex
CREATE INDEX "userlist_userId_idx" ON "userlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userlist_listId_userId_key" ON "userlist"("listId", "userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");
