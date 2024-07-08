import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextResponse.json({ message: 'Hello word' });
  } catch (error: any) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ error: error.message });
  }
}
