-- CreateTable
CREATE TABLE `invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL,
    `listId` INTEGER NOT NULL,
    `inviterId` INTEGER NOT NULL,
    `expiresAt` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(0) NULL,

    UNIQUE INDEX `code`(`code`),
    INDEX `inviterId`(`inviterId`),
    INDEX `listId`(`listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `list` (
    `listId` INTEGER NOT NULL AUTO_INCREMENT,
    `listName` VARCHAR(45) NOT NULL,
    `iconId` INTEGER NOT NULL DEFAULT 0,
    `canBeDeleted` BOOLEAN NULL DEFAULT true,
    `isShared` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(0) NULL,
    `isFavorite` BOOLEAN NULL DEFAULT false,
    `isArchived` BOOLEAN NULL DEFAULT false,
    `createdBy` INTEGER NULL DEFAULT -1,
    `colorVariant` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`listId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subtask` (
    `subtaskId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `taskId` INTEGER NOT NULL,
    `isCompleted` BOOLEAN NULL DEFAULT false,
    `addedBy` VARCHAR(45) NOT NULL,
    `createdAt` DATETIME(0) NULL,

    INDEX `taskId`(`taskId`),
    PRIMARY KEY (`subtaskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `taskId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `listId` INTEGER NOT NULL,
    `isCompleted` BOOLEAN NULL DEFAULT false,
    `deadline` DATETIME(0) NULL,
    `importance` VARCHAR(191) NULL DEFAULT 'Not important',
    `urgency` VARCHAR(191) NULL DEFAULT 'Not urgent',
    `note` TEXT NULL,
    `addedBy` INTEGER NOT NULL,
    `assignedTo` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NULL,
    `notificationTime` DATETIME(0) NULL,

    INDEX `listId`(`listId`),
    PRIMARY KEY (`taskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(30) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(61) NOT NULL,
    `photo` BLOB NULL,
    `idDefaultList` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `email`(`email`),
    INDEX `idDefaultList`(`idDefaultList`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userlist` (
    `listId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `userId`(`userId`),
    UNIQUE INDEX `UserList_listId_userId_unique`(`listId`, `userId`),
    PRIMARY KEY (`listId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(0) NOT NULL,

    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `list`(`listId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_ibfk_2` FOREIGN KEY (`inviterId`) REFERENCES `user`(`userId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subtask` ADD CONSTRAINT `subtask_ibfk_1` FOREIGN KEY (`taskId`) REFERENCES `task`(`taskId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `list`(`listId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`idDefaultList`) REFERENCES `list`(`listId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userlist` ADD CONSTRAINT `userlist_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `list`(`listId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userlist` ADD CONSTRAINT `userlist_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
