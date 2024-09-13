'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import getUser from '@/actions/User';

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  photoURL: string | null;
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

  const fetchUserData = useCallback(async () => {
    try {
      const userNewData = await getUser();
      setUser(userNewData);
      localStorage.setItem('user', JSON.stringify(userNewData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    fetchUserData();
  }, [fetchUserData]);

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
