import { signUp } from '@/controllers/User';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const data = req.body;
    // const result = await signUp(data);
    // return res.status(200).json(result);
    return NextResponse.json({ message: 'Hello work' });
    return res.status(200).json({ message: 'Hello, World!' });
  } catch (error: any) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ error: error.message });
  }
}
