import { verifySession } from '@/lib/session';
import { ISubtask } from '@/types/Subtask';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateSubtaskInDb = async (token: string, subtask: ISubtask) => {
  try {
    const session = await verifySession(token);

    if (!session.isAuth || !session.userId) {
      return null;
    }

    const existingSubtask = await prisma.subtask.findUnique({
      where: {
        subtaskId: subtask.subtaskId,
      },
    });

    if (!existingSubtask) {
      return null;
    }

    const updatedSubtask = await prisma.subtask.update({
      where: {
        subtaskId: subtask.subtaskId,
      },
      data: {
        title: subtask.title ?? existingSubtask.title,
        isCompleted: subtask.isCompleted ?? existingSubtask.isCompleted,
        updatedAt: new Date(),
      },
    });
    return updatedSubtask;
  } catch (error) {
    console.error('Error updating subtask:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
