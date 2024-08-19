'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '../lib/session';
import { cache } from 'react';
import { revalidateTag } from 'next/cache';

const prisma = new PrismaClient();

export const fetchUsersLists = cache(async (token: string) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth) {
      return;
    }

    const usersLists = await prisma.list.findMany({
      where: {
        createdBy: session?.userId,
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
  listName: string,
  iconId: number,
  colorVariant: number
) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth) {
      return;
    }

    const updatedList = await prisma.list.update({
      where: {
        listId: listId,
        createdBy: session.userId,
      },
      data: {
        listName: listName,
        iconId: iconId,
        colorVariant: colorVariant,
        updatedAt: new Date(),
      },
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
