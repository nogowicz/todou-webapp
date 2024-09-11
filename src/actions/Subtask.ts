'use server';

import { ISubtask } from '@/types/Subtask';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const token = cookies().get('session')?.value ?? '';

export async function updateSubtaskRequest(token: string, subtask: ISubtask) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/subtask`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subtask,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update subtask: ${error.message}`);
    }
    throw error;
  }
}

export async function updateSubtask(subtask: ISubtask) {
  await updateSubtaskRequest(token, subtask);
  revalidateTag('userLists');
}
