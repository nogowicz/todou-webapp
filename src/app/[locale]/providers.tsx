import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import UserProvider from './utils/Providers/UserProvider';

export async function Providers({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages}>
        <UserProvider>{children}</UserProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
