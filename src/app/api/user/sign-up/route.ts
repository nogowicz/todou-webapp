import { signUp } from '@/controllers/User';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await signUp(data);
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
}
