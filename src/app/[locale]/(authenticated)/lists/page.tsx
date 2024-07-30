import styles from './page.module.scss';
import ListContainer from '@/components/list-container/ListContainer';
import { getLists } from '@/actions/List';

export default async function Lists() {
  const data = await getLists();
  return (
    <main className={styles.listPage}>
      <ListContainer lists={data} />
    </main>
  );
}
