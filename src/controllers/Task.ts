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
  notificationTime: Date | null,
  sortId: number
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
        sortId: sortId,
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
        sortId: task.sortId ?? existingTask.sortId,
      },
    });
    if (task.subtask) {
      for (const subtask of task.subtask) {
        if (subtask.subtaskId > 0) {
          await prisma.subtask.update({
            where: { subtaskId: subtask.subtaskId },
            data: {
              title: subtask.title,
              isCompleted: subtask.isCompleted,
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.subtask.create({
            data: {
              title: subtask.title,
              isCompleted: subtask.isCompleted,
              taskId: task.taskId,
              addedBy: session.userId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
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

export const updateTaskSortIdInDb = async (tasks: ITask[]) => {
  try {
    const updatePromises = tasks.map((task) =>
      prisma.task.update({
        where: { taskId: task.taskId },
        data: { sortId: task.sortId, isCompleted: task.isCompleted },
      })
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating task sort ID:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTaskInDb = async (token: string, taskId: number) => {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return null;
    }

    const task = await prisma.task.findUnique({
      where: { taskId: taskId },
      include: { subtask: true },
    });

    if (!task) {
      return null;
    }

    await prisma.subtask.deleteMany({
      where: { taskId: taskId },
    });

    const deletedTask = await prisma.task.delete({
      where: { taskId: taskId },
    });

    return deletedTask;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
