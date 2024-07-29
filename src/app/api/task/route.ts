import { createNewTaskInDb } from '@/controllers/Task';
import { decrypt } from '@/lib/session';

export async function POST(request: Request) {
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
    const {
      title,
      deadline,
      importance,
      urgency,
      subtask,
      listId,
      note,
      notificationTime,
    } = requestData;

    if (!title) {
      return new Response(JSON.stringify({ message: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newTask = await createNewTaskInDb(
      token,
      title,
      deadline,
      importance,
      urgency,
      subtask,
      listId,
      note,
      notificationTime
    );

    return new Response(JSON.stringify(newTask), {
      status: 201,
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
