import { NextApiRequest, NextApiResponse } from 'next';
import { updateTaskSortIdInDb } from '@/controllers/Task';
import { decrypt } from '@/lib/session';

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await decrypt(token);

    if (!decodedToken) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const requestData = await request.json();
    const { tasks } = requestData;

    if (!Array.isArray(tasks) || tasks.some((task) => !task.taskId)) {
      return new Response(JSON.stringify({ message: 'Invalid tasks data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await updateTaskSortIdInDb(tasks);
    return new Response(
      JSON.stringify({ message: 'Sort IDs updated successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ message: 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
