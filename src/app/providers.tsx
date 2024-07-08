import { ThemeProvider } from 'next-themes';
import ReactQueryProvider from './utils/Providers/ReactQueryProvider';
import UserProvider from './utils/Providers/UserProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
