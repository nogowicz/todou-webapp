import ListContainer from '@/components/list-container/ListContainer';

import styles from './default.module.scss';

export default async function List() {
  return (
    <div className={styles.listContainer}>
      <ListContainer />
    </div>
  );
}
