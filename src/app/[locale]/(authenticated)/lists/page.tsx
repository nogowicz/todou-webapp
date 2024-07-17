import { IList } from '@/types/List';
import { cookies } from 'next/headers';
import getLists from '../../utils/apiCalls/getUsersLists';

import styles from './page.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';
import ListManager from '@/components/list-manager/ListManager';
import ListItem from '@/components/list-item/ListItem';
import { useTranslations } from 'next-intl';

export default async function Lists() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value ?? '';

  const lists: IList[] = await getLists(token);

  if (!lists) {
    return <div>{<p>No Lists Found</p>}</div>;
  }

  return (
    <main className={styles.listPage}>
      <div className={styles.listPage__upperContainer}>
        <UserPanel />
      </div>
      <ListManager />
      <div className={styles.listPage__listsContainer}>
        {lists.map((list: IList) => (
          <ListItem key={list.listId} {...list} />
        ))}
      </div>
    </main>
  );
}
