'use server';
import 'server-only';

import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();
const key = new TextEncoder().encode(process.env.JWT_SECRET);

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  const expirationTimestamp = Math.floor(payload.expiresAt.getTime() / 1000);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTimestamp)
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    if (!session) {
      console.error('Session token is undefined or empty');
      return null;
    }

    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error) {
    console.error('Error during JWT verification:', error);
    return null;
  }
}

export async function createSession(token: string) {
  const locale = cookies().get('NEXT_LOCALE')?.value;
  const redirectURL = `/${locale}/`;
  try {
    const session = await decrypt(token);

    if (session) {
      const { userId, expiresAt } = session;

      await prisma.session.create({
        data: {
          userId: userId as number,
          expiresAt: expiresAt as string,
        },
      });

      cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(expiresAt as string),
        sameSite: 'lax',
        path: '/',
      });
    } else {
      throw new Error('Invalid session token');
    }
  } catch (error) {
    console.error('Error creating session:', error);
  } finally {
    redirect(redirectURL);
  }
}

export async function verifySession(token: string) {
  try {
    if (!token) {
      console.log('Invalid token');
      return { isAuth: false, error: 'Invalid token' };
    }

    const session = await decrypt(token);

    if (!session || !session.userId) {
      console.log('No valid session found');
      return { isAuth: false, error: 'No valid session found' };
    }

    return { isAuth: true, userId: Number(session.userId) };
  } catch (error) {
    console.error('Error verifying session:', error);
    return { isAuth: false, error: 'Error verifying session' };
  }
}

export async function updateSession() {
  const session = cookies().get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete('session');
}
