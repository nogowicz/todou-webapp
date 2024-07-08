'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '../../_lib/session';
import { cache } from 'react';

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
    });

    return usersLists;
  } catch (error) {
    console.error('Error fetching user lists:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});
