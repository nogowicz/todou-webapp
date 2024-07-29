import UserPanel from '@/components/user-panel/UserPanel';

import styles from './page.module.scss';

export default async function Home() {
  return (
    <main className={styles.homePage}>
      <div className={styles.homePage__upperContainer}>
        <UserPanel />
      </div>
    </main>
  );
}
