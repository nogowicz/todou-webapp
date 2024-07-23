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

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/list`, options);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
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
  const data = await getData(token);
  return data;
}

async function createNewList(
  token: string,
  listName: string,
  selectedIcon: number,
  selectedColor: number
) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}api/lists`, {
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
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
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
