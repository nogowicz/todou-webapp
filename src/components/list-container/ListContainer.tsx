'use client';
import React from 'react';

import { IList } from '@/types/List';
import ListItem from '../list-item/ListItem';
import { useListContext } from '@/utils/Providers/ListProvider';

import styles from './list-container.module.scss';

export default function ListContainer() {
  const { optimisticLists } = useListContext();

  return (
    <div className={styles.listsContainer__grid}>
      {optimisticLists.map((list: IList) => (
        <ListItem key={list.listId} list={list} listStyle="grid" />
      ))}
      {optimisticLists.map((list: IList) => (
        <ListItem key={list.listId} list={list} listStyle="grid" />
      ))}
      {optimisticLists.map((list: IList) => (
        <ListItem key={list.listId} list={list} listStyle="grid" />
      ))}
      {optimisticLists.map((list: IList) => (
        <ListItem key={list.listId} list={list} listStyle="grid" />
      ))}
      {optimisticLists.map((list: IList) => (
        <ListItem key={list.listId} list={list} listStyle="grid" />
      ))}
    </div>
  );
}
