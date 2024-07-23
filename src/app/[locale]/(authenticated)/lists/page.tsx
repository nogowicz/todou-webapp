import { IList } from '@/types/List';
import styles from './page.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';
import ListManager from '@/components/list-manager/ListManager';
import ListItem from '@/components/list-item/ListItem';
import { getLists } from '../../utils/apiCalls/List';

export default async function Lists() {
  const data = await getLists();
  return (
    <main className={styles.listPage}>
      <div className={styles.listPage__upperContainer}>
        <UserPanel />
      </div>
      <ListManager lists={data} />
      <div className={styles.listPage__listsContainer}>
        {data.map((list: IList) => (
          <ListItem key={list.listId} {...list} />
        ))}
      </div>
    </main>
  );
}
