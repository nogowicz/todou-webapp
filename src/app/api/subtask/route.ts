import { updateSubtaskInDb } from '@/controllers/Subtask';
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
    const { subtask } = requestData;

    if (!subtask.subtaskId) {
      return new Response(
        JSON.stringify({ message: 'Subtask ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const updatedSubtask = await updateSubtaskInDb(token, subtask);

    if (!updatedSubtask) {
      return new Response(JSON.stringify({ message: 'Subtask not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedSubtask), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
