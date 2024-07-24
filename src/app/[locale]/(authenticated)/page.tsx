import UserPanel from '@/components/user-panel/UserPanel';

import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.welcomePage}>
      <div className={styles.welcomePage__upperContainer}>
        <UserPanel />
      </div>
    </main>
  );
}
