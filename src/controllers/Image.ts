import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function uploadImage(token: string, photoURL: string) {
  try {
    const session = await verifySession(token);

    if (!session?.isAuth || !session.userId) {
      return;
    }

    const userId = session.userId;
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user || !userId) {
      throw new Error('User not found');
    }

    await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        photoURL: photoURL,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
