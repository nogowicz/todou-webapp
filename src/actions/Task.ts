'use server';

import { TaskImportance, TaskUrgency } from '@/types/Task';
import { cookies } from 'next/headers';
import { getLists } from './List';
import { revalidateTag } from 'next/cache';

export async function addNewTask(
  token: string,
  title: string,
  deadline: Date | null,
  importance: TaskImportance | null,
  urgency: TaskUrgency | null,
  subtask: string[],
  listId: number,
  note: string | null,
  notificationTime: Date | null
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
  subtask: string[],
  listId: number,
  note: string | null,
  notificationTime: Date | null
) {
  const token = cookies().get('session')?.value ?? '';
  await addNewTask(
    token,
    title,
    deadline,
    importance,
    urgency,
    subtask,
    listId,
    note,
    notificationTime
  );
  revalidateTag('userLists');
}
