'use server';
import ListContainer from '@/components/list-container/ListContainer';

import styles from './page.module.scss';

export default async function List() {
  return (
    <div className={styles.listContainer}>
      <ListContainer />
    </div>
  );
}
