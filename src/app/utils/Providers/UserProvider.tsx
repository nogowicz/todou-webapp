'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createSession, deleteSession } from '../../../../_lib/session';
import { useRouter } from 'next/navigation';

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  photo: string | null;
  idDefaultList: number;
  isVerified: boolean;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (responseData: Object) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface IUserProvider {
  children: React.ReactNode;
}

export default function UserProvider({ children }: IUserProvider) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (responseData: any) => {
    createSession(responseData.token);
    setUser(responseData.user);
    setToken(responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    localStorage.setItem('token', responseData.token);
  };

  const logout = () => {
    deleteSession();
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.replace('/welcome');
  };

  const value: UserContextType = {
    user,
    token,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
