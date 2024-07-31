import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Providers } from './providers';

import './globals.scss';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'Todou',
  description:
    'Simplify your life and boost productivity with Todou. Organize tasks, set priorities, and track progress effortlessly. Stay on top of your to-do list with smart reminders and seamless syncing. Manage work, school, or personal projects with ease. Get things done with Todou!',
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
