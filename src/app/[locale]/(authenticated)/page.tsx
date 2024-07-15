import { useTranslations } from 'next-intl';
import styles from './page.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <main className={styles.welcomePage}>
      <div className={styles.welcomePage__upperContainer}>
        <UserPanel />
      </div>
    </main>
  );
}
