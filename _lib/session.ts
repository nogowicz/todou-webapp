'use server';
import 'server-only';

import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const key = new TextEncoder().encode(process.env.JWT_SECRET);

const cookie: any = {
  name: 'session',
  options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
  duration: 24 * 60 * 60 * 1000,
};

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId: id,
      expiresAt,
    },
  });

  const session = await encrypt({ userId: id, expiresAt });

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
export async function verifySession() {}

export async function deleteSession() {}
