'use client';
import React, { cloneElement } from 'react';

import { IList } from '@/types/List';
import { listColorTheme, listIconTheme } from './ListStyles';

import Link from 'next/link';

import styles from './list-item.module.scss';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ITask } from '@/types/Task';
import { GoPeople } from 'react-icons/go';
interface IListItem {
  list: IList;
  listStyle: 'list' | 'grid';
}

export default function ListItem({ list, listStyle }: IListItem) {
  const currentPath = usePathname();
  const t = useTranslations('Tasks');
  const index = currentPath.split('/').pop();
  const listModifierClass =
    listStyle === 'grid' ? styles['listItem--grid'] : styles['listItem--list'];

  const taskAmountClass =
    listStyle === 'grid'
      ? styles['listItem--grid__taskAmount']
      : styles['listItem--list__taskAmount'];

  const inCompleteTasks: ITask[] = list.task.filter(
    (task) => !task.isCompleted
  );
  return (
    <div
      className={listModifierClass}
      style={{
        backgroundColor: `${listColorTheme[list.colorVariant]}30`,
        borderColor:
          index && +index === list.listId
            ? `${listColorTheme[list.colorVariant]}`
            : '',
      }}
    >
      <Link href={`/lists/${list.listId}`} className={styles.listItem}>
        <div
          className={taskAmountClass}
          style={{
            backgroundColor: `${listColorTheme[list.colorVariant]}`,
          }}
        >
          {list.isShared && <GoPeople />}
          {inCompleteTasks.length}
        </div>
        {cloneElement(listIconTheme[list.iconId], {
          size: listStyle === 'grid' ? 130 : 40,
          color: `${listColorTheme[list.colorVariant]}50`,
        })}
        <p>{list.listName === 'Tasks' ? t('tasks') : list.listName}</p>
      </Link>
    </div>
  );
}
