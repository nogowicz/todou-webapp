'use client';
import React from 'react';

import { IList } from '@/types/List';
import ListItem from '../list-item/ListItem';

import styles from './list-container.module.scss';
import { useListContext } from '@/app/[locale]/utils/Providers/ListProvider';

export default function ListContainer() {
  const { optimisticLists, listStyle } = useListContext();
  const listModifierClass =
    listStyle === 'grid'
      ? styles.listsContainer__grid
      : styles.listsContainer__list;

  return (
    <div className={listModifierClass}>
      {optimisticLists.map((list: IList) => (
        <ListItem key={list.listId} list={list} listStyle={listStyle} />
      ))}
    </div>
  );
}
