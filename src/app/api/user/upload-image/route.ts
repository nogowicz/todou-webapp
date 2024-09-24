import { uploadImage } from '@/controllers/Image';
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
    const { photoURL } = requestData;

    if (!photoURL) {
      return new Response(JSON.stringify({ message: 'Invalid request body' }), {
        status: 400,
      });
    }

    await uploadImage(token, photoURL);

    return new Response(
      JSON.stringify({ message: 'Image uploaded successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log('ROUTE ERROR:', error);

    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
