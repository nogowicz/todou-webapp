import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const setCookiesTheme = async (newTheme: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  console.log('TETS', newTheme);
  try {
    const response = await fetch(`${BASE_URL}/api/theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: newTheme }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error('Failed to set theme cookie:', response.statusText);
    }
  } catch (error) {
    console.error('Error setting theme cookie:', error);
  }
};

export function useMountedTheme() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, [resolvedTheme]);

  const toggleTheme = async () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
      await setCookiesTheme('light');
    } else {
      setTheme('dark');
      await setCookiesTheme('dark');
    }
  };

  return { mounted, resolvedTheme, setTheme, toggleTheme };
}
