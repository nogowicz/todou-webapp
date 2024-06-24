import styles from './page.module.scss';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';

export default function Home() {
  return (
    <main className={styles.main}>
      <ThemeSwitch />
    </main>
  );
}
