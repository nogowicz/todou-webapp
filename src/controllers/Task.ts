import { verifySession } from '@/lib/session';
import { TaskImportance, TaskUrgency } from '@/types/Task';
import { PrismaClient } from '@prisma/client';
import { revalidateTag } from 'next/cache';

const prisma = new PrismaClient();

export const createNewTaskInDb = async (
  token: string,
  title: string,
  deadline: Date | null,
  importance: TaskImportance,
  urgency: TaskUrgency,
  subtask: string[],
  listId: number,
  note: string | null,
  notificationTime: Date | null
) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        title: title,
        deadline: deadline,
        importance: importance,
        isCompleted: false,
        urgency: urgency,
        listId: listId,
        subtask: {
          create: subtask.map((subtaskTitle) => ({
            title: subtaskTitle,
            addedBy: session.userId.toString(), // Ensure this is a string
            createdAt: new Date(),
            isCompleted: false,
          })),
        },
        note: note,
        notificationTime: notificationTime,
        createdAt: new Date(),
        assignedTo: Number(session.userId),
        addedBy: Number(session.userId),
      },
    });

    return newTask;
  } catch (error) {
    console.error('Error creating new task:', error);
    throw error;
  } finally {
    revalidateTag('userLists');
    await prisma.$disconnect();
  }
};
