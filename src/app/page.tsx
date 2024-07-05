'use client';
import { getUser, logout } from '@/controllers/User';

import styles from './page.module.scss';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';

export default function Home() {
  return (
    <main className={styles.main}>
      <ThemeSwitch />
      <button onClick={() => logout()}>Log out</button>
    </main>
  );
}
