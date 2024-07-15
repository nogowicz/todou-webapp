import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useMountedTheme() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, [resolvedTheme]);

  const toggleTheme = async () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return { mounted, resolvedTheme, setTheme, toggleTheme };
}
