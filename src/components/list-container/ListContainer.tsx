'use client';
import React from 'react';

import { IList } from '@/types/List';
import ListItem from '../list-item/ListItem';

import styles from './list-container.module.scss';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useListContext } from '@/utils/Providers/ListProvider';

export default function ListContainer() {
  const { optimisticLists } = useListContext();
  const currentPathname = usePathname();
  const locale = useLocale();
  const isExactListPath = currentPathname === `/${locale}/lists`;
  // const listModifierClass = isExactListPath
  //   ? styles.listsContainer__grid
  //   : styles.listsContainer__list;

  return (
    <div
      // className={listModifierClass}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: isExactListPath ? '60px' : '30px',
        flexDirection: isExactListPath ? 'row' : 'column',
      }}
    >
      {optimisticLists.map((list: IList) => (
        <ListItem
          key={list.listId}
          list={list}
          listStyle={isExactListPath ? 'grid' : 'list'}
        />
      ))}
    </div>
  );
}
