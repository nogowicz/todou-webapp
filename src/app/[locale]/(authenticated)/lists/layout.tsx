import React from 'react';

import styles from './layout.module.scss';
import ListManager from '@/components/list-manager/ListManager';

interface IListsLayout {
  lists: React.ReactNode;
  details: React.ReactNode;
}

export default function ListsLayout({ lists, details }: IListsLayout) {
  return (
    <>
      <ListManager />
      <div className={styles.layoutContainer}>
        <section className={styles.layoutContainer__lists}>{lists}</section>
        <section className={styles.layoutContainer__details}>{details}</section>
      </div>
    </>
  );
}
