'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error('Base URL is not defined');
}

async function createInvitationInDb(token: string, listId: number) {
  try {
    const response = await fetch(`${BASE_URL}/api/invitation`, {
      method: 'POST',
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
    console.error('Failed to create new invitation:', error);
    throw error;
  }
}

export async function createInvitation(listId: number) {
  const token = cookies().get('session')?.value ?? '';
  const invitation = await createInvitationInDb(token, listId);
  return invitation;
}
