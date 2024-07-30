import React, { cloneElement } from 'react';

import { IList } from '@/types/List';
import { listColorTheme, listIconTheme } from './ListStyles';

import styles from './list-item.module.scss';

interface IListItem {
  list: IList;
  listStyle: 'list' | 'grid';
}

export default function ListItem({ list, listStyle }: IListItem) {
  const listModifierClass =
    listStyle === 'grid' ? styles.listItem__grid : styles.listItem__list;
  return (
    <div
      className={listModifierClass}
      style={{
        backgroundColor: `${listColorTheme[list.colorVariant]}30`,
      }}
    >
      <div
        className={styles.listItem__taskAmount}
        style={{
          backgroundColor: `${listColorTheme[list.colorVariant]}`,
        }}
      >
        {list.task.length}
      </div>
      {cloneElement(listIconTheme[list.iconId], {
        size: listStyle === 'grid' ? 130 : 40,
        color: `${listColorTheme[list.colorVariant]}50`,
      })}
      <p>{list.listName}</p>
    </div>
  );
}
