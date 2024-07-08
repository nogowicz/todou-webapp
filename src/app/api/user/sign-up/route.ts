import { signUp } from '@/controllers/User';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await signUp(data);
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ message: error.message });
    }
  }
}
