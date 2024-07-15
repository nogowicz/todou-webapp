import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { theme } = await req.json();
  const response = NextResponse.json({ message: 'Theme updated' });
  response.cookies.set('theme', theme);
  return response;
}
