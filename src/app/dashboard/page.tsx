'use client';
import { logout } from '@/controllers/User';

import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';

export default function Home() {
  return (
    <main>
      <ThemeSwitch />
      <button onClick={() => logout()}>Log out</button>
    </main>
  );
}
