import { fetchUsersLists } from '@/controllers/List';
import { decrypt } from '../../../lib/session';

export async function GET(request: Request) {
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

    const result = await fetchUsersLists(token);
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
}
