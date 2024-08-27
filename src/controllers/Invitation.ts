'use server';

import { revalidateLists } from '@/actions/List';
import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createInvitation = async (token: string, listId: number) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return;
    }

    const userId = session.userId;
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user || !userId) {
      throw new Error('User not found');
    }

    if (user?.idDefaultList === listId) {
      throw new Error('You cannot invite yourself to your default list');
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        listId: listId,
      },
    });

    if (existingInvitation) {
      return existingInvitation;
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    async function generateUniqueCode(): Promise<string> {
      while (true) {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingInvitation = await prisma.invitation.findFirst({
          where: {
            code: newCode,
          },
        });
        if (!existingInvitation) {
          return newCode;
        }
      }
    }

    const code = await generateUniqueCode();

    const invitation = await prisma.invitation.create({
      data: {
        listId: listId,
        code: code,
        inviterId: userId,
        expiresAt: expiresAt,
        createdAt: new Date(),
      },
    });

    return invitation;
  } catch (error) {
    console.error('Error creating new invitation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const verifyInvitation = async (token: string, code: string) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return;
    }

    const invitation = await prisma.invitation.findUnique({
      where: {
        code: code,
      },
    });

    if (!invitation) {
      return { error: 'Invitation not found' };
    }

    if (invitation.inviterId === session.userId) {
      return { error: 'You cannot invite yourself to your own list' };
    }

    if (invitation.expiresAt < new Date()) {
      return { error: 'Invitation expired' };
    }

    if (invitation) {
      await prisma.userlist.create({
        data: {
          userId: session.userId,
          listId: invitation.listId,
        },
      });

      const updateList = await prisma.list.update({
        where: {
          listId: invitation.listId,
        },
        data: {
          isShared: true,
        },
      });

      return updateList;
    }
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return { error: 'Error verifying invitation' };
  } finally {
    revalidateLists();
    await prisma.$disconnect();
  }
};
