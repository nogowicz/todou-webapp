'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error('Base URL is not defined');
}

async function fetchData(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`Error fetching data from ${url}:`, err);
    throw err;
  }
}

async function getData(token: string) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
    next: { tags: ['userLists'] },
  };

  return fetchData(`${BASE_URL}/api/list`, options);
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
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      listName,
      icon: selectedIcon,
      color: selectedColor,
    }),
  };

  return fetchData(`${BASE_URL}/api/lists`, options);
}

export async function createList(
  listName: string,
  selectedIcon: number,
  selectedColor: number
) {
  const token = cookies().get('session')?.value ?? '';
  return createNewList(token, listName, selectedIcon, selectedColor);
}
