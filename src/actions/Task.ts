'use server';

import { ITask, TaskImportance, TaskUrgency } from '@/types/Task';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { ISubtask } from '@/types/Subtask';

const token = cookies().get('session')?.value ?? '';

export async function createTaskRequest(
  token: string,
  title: string,
  deadline: Date | null,
  importance: TaskImportance | null,
  urgency: TaskUrgency | null,
  subtask: ISubtask[],
  listId: number,
  note: string | null,
  notificationTime: Date | null,
  sortId: number
) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/task`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        deadline,
        importance,
        urgency,
        subtask,
        listId,
        note,
        notificationTime,
        sortId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to add new task: ${error.message}`);
    }
    throw error;
  }
}

export async function createTask(
  title: string,
  deadline: Date | null,
  importance: TaskImportance | null,
  urgency: TaskUrgency | null,
  subtask: ISubtask[],
  listId: number,
  note: string | null,
  notificationTime: Date | null,
  sortId: number
) {
  await createTaskRequest(
    token,
    title,
    deadline,
    importance,
    urgency,
    subtask,
    listId,
    note,
    notificationTime,
    sortId
  );
  revalidateTag('userLists');
}

export async function updateTaskRequest(token: string, task: ITask) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/task`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
    throw error;
  }
}

export async function updateTask(task: ITask) {
  await updateTaskRequest(token, task);
  revalidateTag('userLists');
}

export async function deleteTaskRequest(token: string, taskId: number) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/task`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
    throw error;
  }
}

export const updateSortIdInDb = async (tasks: ITask[]) => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const token = cookies().get('session')?.value ?? '';

    await fetch(`${BASE_URL}/api/task/updateSortId`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tasks }),
    });
  } catch (error) {
    console.error('Failed to update sort IDs in the database:', error);
  } finally {
    revalidateTag('userLists');
  }
};

export async function deleteTask(taskId: number) {
  await deleteTaskRequest(token, taskId);
  revalidateTag('userLists');
}
