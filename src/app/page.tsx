'use client';

import styles from './page.module.scss';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';
import { useUser } from './utils/Providers/UserProvider';

export default function Home() {
  const { logout } = useUser();
  return (
    <main className={styles.main}>
      <ThemeSwitch />
      <button
        onClick={() => {
          logout();
        }}
      >
        Log out
      </button>
    </main>
  );
}
