'use server';

import { cookies } from 'next/headers';

const token = cookies().get('session')?.value ?? '';

async function uploadImageRequest(token: string, file: File) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/user/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload new image: ${error.message}`);
    }
    throw error;
  }
}

export async function uploadImage(file: File) {
  await uploadImageRequest(token, file);
}
