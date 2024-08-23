import { createInvitation } from '@/controllers/Invitation';
import { decrypt } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }
    const token = authHeader.split(' ')[1];

    const decodedToken = await decrypt(token);

    if (!decodedToken) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 403,
      });
    }

    const requestData = await request.json();
    const { listId } = requestData;
    if (!listId) {
      return new Response(JSON.stringify({ message: 'Invalid request body' }), {
        status: 400,
      });
    }

    const invitation = await createInvitation(token, listId);

    return new Response(JSON.stringify(invitation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
}
