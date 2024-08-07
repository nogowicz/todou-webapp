import { verifySession } from '@/lib/session';
import { ISubtask } from '@/types/Subtask';
import { ITask, TaskImportance, TaskUrgency } from '@/types/Task';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNewTaskInDb = async (
  token: string,
  title: string,
  deadline: Date | null,
  importance: TaskImportance,
  urgency: TaskUrgency,
  subtask: ISubtask[],
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
          create: subtask.map((subtask) => ({
            title: subtask.title,
            addedBy: session.userId,
            createdAt: new Date(),
            isCompleted: false,
          })),
        },
        note: note,
        notificationTime: notificationTime,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: Number(session.userId),
        addedBy: Number(session.userId),
      },
    });
    return newTask;
  } catch (error) {
    console.error('Error creating new task:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const updateTaskInDb = async (token: string, task: ITask) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return null;
    }

    const existingTask = await prisma.task.findUnique({
      where: { taskId: task.taskId },
      include: { subtask: true },
    });

    if (!existingTask) {
      return null;
    }

    const existingSubtaskIds = existingTask.subtask.map(
      (subtask) => subtask.subtaskId
    );
    const updatedSubtaskIds = task.subtask.map((subtask) => subtask.subtaskId);

    const subtasksToRemove = existingSubtaskIds.filter(
      (id) => !updatedSubtaskIds.includes(id)
    );

    await prisma.subtask.deleteMany({
      where: {
        subtaskId: {
          in: subtasksToRemove,
        },
      },
    });

    const updatedTask = await prisma.task.update({
      where: { taskId: task.taskId },
      data: {
        title: task.title ?? existingTask.title,
        isCompleted: task.isCompleted ?? existingTask.isCompleted,
        deadline: task.deadline ?? existingTask.deadline,
        importance: task.importance ?? existingTask.importance,
        urgency: task.urgency ?? existingTask.urgency,
        listId: task.listId ?? existingTask.listId,
        note: task.note ?? existingTask.note,
        notificationTime:
          task.notificationTime ?? existingTask.notificationTime,
        updatedAt: new Date(),
        assignedTo: task.assignedTo ?? existingTask.assignedTo,
      },
    });
    if (task.subtask) {
      for (const subtask of task.subtask) {
        if (existingTask.taskId !== subtask.taskId) {
          throw new Error(
            `Subtask with taskId ${subtask.taskId} does not match the current task.`
          );
        }
        await prisma.subtask.upsert({
          where: { subtaskId: subtask.subtaskId },
          update: {
            title: subtask.title,
            isCompleted: subtask.isCompleted,
          },
          create: {
            subtaskId: subtask.subtaskId,
            title: subtask.title,
            isCompleted: subtask.isCompleted,
            taskId: task.taskId,
            addedBy: session.userId,
          },
        });
      }
    }

    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
