'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error('Base URL is not defined');
}

async function getData(token: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
      next: { tags: ['userLists'] },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

export async function getLists() {
  const token = cookies().get('session')?.value ?? '';
  return getData(token);
}

async function createNewList(
  token: string,
  listName: string,
  selectedIcon: number,
  selectedColor: number
) {
  try {
    const response = await fetch(`${BASE_URL}/api/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName: listName,
        iconId: selectedIcon,
        colorVariant: selectedColor,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create new list:', error);
    throw error;
  }
}

export async function createList(
  listName: string,
  selectedIcon: number,
  selectedColor: number
) {
  const token = cookies().get('session')?.value ?? '';
  await createNewList(token, listName, selectedIcon, selectedColor);

  revalidateLists();
}

async function updateExistingList(
  token: string,
  listId: number,
  listName?: string,
  selectedIcon?: number,
  selectedColor?: number,
  isArchived?: boolean,
  isShared?: boolean
) {
  try {
    const response = await fetch(`${BASE_URL}/api/list`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listId,
        listName,
        selectedIcon,
        selectedColor,
        isArchived,
        isShared,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update list:', error);
    throw error;
  }
}

export async function updateList(
  listId: number,
  listName?: string,
  selectedIcon?: number,
  selectedColor?: number,
  isArchived?: boolean,
  isShared?: boolean
) {
  const token = cookies().get('session')?.value ?? '';
  await updateExistingList(
    token,
    listId,
    listName,
    selectedIcon,
    selectedColor,
    isArchived,
    isShared
  );
  revalidateLists();
}

export async function deleteListRequest(token: string, listId: number) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/list`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete list: ${error.message}`);
    }
    throw error;
  }
}

export async function deleteList(listId: number) {
  const token = cookies().get('session')?.value ?? '';
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'en';
  await deleteListRequest(token, listId);
  revalidateTag('userLists');
  redirect(`/${locale}/lists`);
}

export async function deleteCompletedTasksInListRequest(
  token: string,
  listId: number
) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/list/tasks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to delete completed tasks in list: ${error.message}`
      );
    }
    throw error;
  }
}

export async function deleteCompletedTasksInList(listId: number) {
  const token = cookies().get('session')?.value ?? '';
  await deleteCompletedTasksInListRequest(token, listId);
  revalidateLists();
}

export async function revalidateLists() {
  revalidateTag('lists');
}
