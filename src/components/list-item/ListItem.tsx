import React, { cloneElement } from 'react';

import { IList } from '@/types/List';
import { listColorTheme, listIconTheme } from './ListStyles';

import Link from 'next/link';

import styles from './list-item.module.scss';
import { usePathname } from 'next/navigation';
interface IListItem {
  list: IList;
  listStyle: 'list' | 'grid';
}

export default function ListItem({ list, listStyle }: IListItem) {
  const currentPath = usePathname();
  const index = currentPath.split('/').pop();
  // const listModifierClass =
  //   listStyle === 'grid' ? styles.listItem__grid : styles.listItem__list;
  const isGrid = listStyle === 'grid';
  return (
    <Link href={`/lists/${list.listId}`} className={styles.listItem}>
      <div
        // className={listModifierClass}
        style={{
          backgroundColor: `${listColorTheme[list.colorVariant]}30`,
          position: 'relative',
          borderRadius: '10px',
          padding: isGrid ? '20px' : '0 20px',
          minHeight: isGrid ? '180px' : 0,
          width: isGrid ? '295px' : '85%',
          display: isGrid ? 'block' : 'flex',
          alignItems: 'center',
          gap: isGrid ? 0 : '20px',
          border:
            index && +index === list.listId
              ? `2px solid ${listColorTheme[list.colorVariant]}`
              : 'none',
        }}
      >
        <div
          // className={styles.listItem__taskAmount}
          style={{
            backgroundColor: `${listColorTheme[list.colorVariant]}`,
            position: 'absolute',
            top: 0,
            right: 0,
            borderRadius: '0 6px 0 6px',
            padding: isGrid ? '5px 15px' : '5px 10px',
            fontSize: isGrid ? '20px' : '16px',
          }}
        >
          {list.task.length}
        </div>
        {cloneElement(listIconTheme[list.iconId], {
          size: listStyle === 'grid' ? 130 : 40,
          color: `${listColorTheme[list.colorVariant]}50`,
          position: isGrid ? 'absolute' : 'relative',
        })}
        <p
          style={{
            zIndex: -1,
            position: isGrid ? 'absolute' : 'relative',
            fontSize: isGrid ? '25px' : '18px',
            fontWeight: 600,
            bottom: 0,
          }}
        >
          {list.listName}
        </p>
      </div>
    </Link>
  );
}
