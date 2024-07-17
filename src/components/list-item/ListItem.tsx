import React, { cloneElement } from 'react';

import { IList } from '@/types/List';

import styles from './list-item.module.scss';
import { listColorTheme, listIconTheme } from './ListStyles';

export default function ListItem(list: IList) {
  return (
    <div
      className={styles.listItem}
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
        size: 130,
        color: `${listColorTheme[list.colorVariant]}50`,
      })}
      <p>{list.listName}</p>
    </div>
  );
}
