'use server';

import { cookies } from 'next/headers';

async function getData(token: string) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
    next: { tags: ['userLists'] },
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    throw new Error('Base URL is not defined');
  }

  try {
    const response = await fetch(`${BASE_URL}/api/list`, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch data: ${response.status} - ${errorText}`
      );
    }
    const lists = await response.json();
    return lists;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

export async function getLists() {
  const token = cookies().get('session')?.value ?? '';
  return await getData(token);
}

async function createNewList(
  token: string,
  listName: string,
  selectedIcon: number,
  selectedColor: number
) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    throw new Error('Base URL is not defined');
  }

  try {
    const response = await fetch(`${BASE_URL}/api/lists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listName: listName,
        icon: selectedIcon,
        color: selectedColor,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create list: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating list:', error);
      throw new Error(`Failed to create list: ${error.message}`);
    }
  }
}

export async function createList(
  listName: string,
  selectedIcon: number,
  selectedColor: number
) {
  const token = cookies().get('session')?.value ?? '';
  await createNewList(token, listName, selectedIcon, selectedColor);
}
