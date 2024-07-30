import styles from './page.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';
import ListContainer from '@/components/list-container/ListContainer';
import { getLists } from '@/actions/List';

export default async function Lists() {
  const data = await getLists();

  return (
    <main className={styles.listPage}>
      <div className={styles.listPage__upperContainer}>
        <UserPanel />
      </div>
      <ListContainer lists={data} />
    </main>
  );
}
