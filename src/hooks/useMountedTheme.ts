import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useMountedTheme() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return { mounted, theme };
}
