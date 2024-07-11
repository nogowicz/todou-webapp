'use server';

import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { encrypt, verifySession } from '../_lib/session';
import { cache } from 'react';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  return hashedPassword;
}

export async function signUp(data: SignUpData) {
  try {
    const { firstName, lastName, email, password } = data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const hashedPassword = await hashPassword(password);

    const defaultUsersList = await prisma.list.create({
      data: {
        listName: 'Tasks',
        canBeDeleted: false,
        createdAt: new Date(),
      },
    });

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        idDefaultList: defaultUsersList.listId,
        createdAt: new Date(),
      },
    });

    await prisma.userlist.create({
      data: {
        userId: newUser.userId,
        listId: defaultUsersList.listId,
      },
    });

    await prisma.list.update({
      where: { listId: defaultUsersList.listId },
      data: { createdBy: newUser.userId },
    });

    const userData = {
      userId: newUser.userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: newUser.createdAt,
      photo: newUser.photo,
      idDefaultList: newUser.idDefaultList,
      isVerified: newUser.isVerified,
    };
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = await encrypt({ userId: newUser.userId, expiresAt });
    return { user: userData, token: token };
  } catch (error) {
    throw error;
  }
}

interface SignInData {
  email: string;
  password: string;
}

export async function signIn(data: SignInData) {
  try {
    const { email, password } = data;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const userData = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      photo: user.photo,
      idDefaultList: user.idDefaultList,
      isVerified: user.isVerified,
    };
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = await encrypt({ userId: user.userId, expiresAt });

    return { user: userData, token: token };
  } catch (error) {
    throw error;
  }
}

export const getUser = cache(async (token: string) => {
  try {
    if (!token) {
      return;
    }

    const session = await verifySession(token);

    if (!session?.isAuth) {
      return;
    }

    const data = await prisma.user.findMany({
      where: { userId: session.userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        photo: true,
        idDefaultList: true,
        isVerified: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});
