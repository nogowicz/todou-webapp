'use server';
import { cookies } from 'next/headers';

async function getData(token: string) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!BASE_URL) {
      throw new Error('Base URL is not defined');
    }
    const response = await fetch(`${BASE_URL}/api/user`, options);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const user = await response.json();
    return user;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

export default async function getUser() {
  const token = cookies().get('session')?.value ?? '';
  const data = await getData(token);
  return data;
}

async function updateUserPhotoRequest(token: string, photoURL: string) {
  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      photoURL,
    }),
  };

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!BASE_URL) {
      throw new Error('Base URL is not defined');
    }
    const response = await fetch(`${BASE_URL}/api/user/upload-image`, options);
    if (!response.ok) {
      throw new Error('Failed to update user photo');
    }
    const user = await response.json();
    return user;
  } catch (err) {
    console.error('Error updating user photo:', err);
    throw err;
  }
}

export async function updateUserPhoto(photoURL: string) {
  const token = cookies().get('session')?.value ?? '';
  return updateUserPhotoRequest(token, photoURL);
}
