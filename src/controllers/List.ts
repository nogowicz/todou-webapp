'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '../lib/session';
import { cache } from 'react';
import { revalidateTag } from 'next/cache';
import { ESortingType } from '@/types/List';

const prisma = new PrismaClient();

export const fetchUsersLists = cache(async (token: string) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth) {
      return;
    }

    const usersLists = await prisma.list.findMany({
      where: {
        OR: [
          { createdBy: session.userId },
          { userlist: { some: { userId: session.userId } } },
        ],
      },
      include: {
        task: {
          include: {
            subtask: true,
          },
        },
      },
    });

    return usersLists;
  } catch (error) {
    console.error('Error fetching user lists:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});

export const createNewList = async (
  token: string,
  listName: string,
  iconId: number,
  colorVariant: number
) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth) {
      return;
    }

    const newList = await prisma.list.create({
      data: {
        listName: listName,
        iconId: iconId,
        colorVariant: colorVariant,
        createdAt: new Date(),
        updatedAt: new Date(),
        canBeDeleted: true,
        isArchived: false,
        isFavorite: false,
        isShared: false,
        createdBy: session.userId,
        sortingType: 'own',
      },
    });

    return newList;
  } catch (error) {
    console.error('Error creating new list:', error);
    throw error;
  } finally {
    revalidateTag('userLists');
    await prisma.$disconnect();
  }
};

export const updateList = async (
  token: string,
  listId: number,
  listName?: string,
  iconId?: number,
  colorVariant?: number,
  isArchived?: boolean,
  isShared?: boolean,
  sortingType?: ESortingType
) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth) {
      return;
    }

    const dataToUpdate: any = {
      updatedAt: new Date(),
    };

    if (listName !== undefined) {
      dataToUpdate.listName = listName;
    }

    if (iconId !== undefined) {
      dataToUpdate.iconId = iconId;
    }

    if (colorVariant !== undefined) {
      dataToUpdate.colorVariant = colorVariant;
    }

    if (isArchived !== undefined) {
      dataToUpdate.isArchived = isArchived;
    }

    if (isShared !== undefined) {
      dataToUpdate.isShared = isArchived;
    }

    if (sortingType !== undefined) {
      dataToUpdate.sortingType = sortingType;
    }

    const updatedList = await prisma.list.update({
      where: {
        listId: listId,
        createdBy: session.userId,
      },
      data: dataToUpdate,
    });

    return updatedList;
  } catch (error) {
    console.error('Error updating list:', error);
    throw error;
  } finally {
    revalidateTag('userLists');
    await prisma.$disconnect();
  }
};

export const deleteListInDb = async (token: string, listId: number) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return null;
    }

    const list = await prisma.list.findUnique({
      where: { listId: listId },
      include: { task: true },
    });

    if (!list) {
      return null;
    }

    const taskIds = list.task.map((task) => task.taskId);

    await prisma.subtask.deleteMany({
      where: {
        taskId: {
          in: taskIds,
        },
      },
    });

    await prisma.task.deleteMany({
      where: { listId: listId },
    });

    const deletedList = await prisma.list.delete({
      where: { listId: listId },
    });

    return deletedList;
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteCompletedTasksInListInDb = async (
  token: string,
  listId: number
) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth) {
      return null;
    }

    const tasksToDelete = await prisma.task.findMany({
      where: {
        listId: listId,
        isCompleted: true,
      },
    });

    if (tasksToDelete.length === 0) {
      return 0;
    }

    await prisma.subtask.deleteMany({
      where: {
        taskId: {
          in: tasksToDelete.map((task) => task.taskId),
        },
      },
    });

    const deletedTasks = await prisma.task.deleteMany({
      where: {
        taskId: {
          in: tasksToDelete.map((task) => task.taskId),
        },
      },
    });

    return deletedTasks.count;
  } catch (error) {
    console.error('Error deleting completed tasks in list:', error);
    throw error;
  }
};
