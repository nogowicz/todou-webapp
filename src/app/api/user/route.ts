import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    return NextResponse.json({ message: 'Hello word' });
  } catch (error) {
    if(error instanceof Error) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ error: error.message });
    }

  }
}
