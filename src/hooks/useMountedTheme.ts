import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useMountedTheme() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return { mounted, resolvedTheme, setTheme };
}
