import ListContainer from '@/components/list-container/ListContainer';

// import styles from './default.module.scss';

export default function List() {
  return (
    <div
      // className={styles.listContainer}
      style={{
        width: '100%',
        height: '95%',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <ListContainer />
    </div>
  );
}
