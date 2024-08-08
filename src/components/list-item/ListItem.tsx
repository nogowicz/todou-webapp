'use client';
import React, { cloneElement } from 'react';

import { IList } from '@/types/List';
import { listColorTheme, listIconTheme } from './ListStyles';

import Link from 'next/link';

import styles from './list-item.module.scss';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ITask } from '@/types/Task';
interface IListItem {
  list: IList;
  listStyle: 'list' | 'grid';
}

export default function ListItem({ list, listStyle }: IListItem) {
  const currentPath = usePathname();
  const t = useTranslations('Tasks');
  const index = currentPath.split('/').pop();
  const listModifierClass =
    listStyle === 'grid' ? styles.listItem__grid : styles.listItem__list;

  const inCompleteTasks: ITask[] = list.task.filter(
    (task) => !task.isCompleted
  );
  return (
    <Link href={`/lists/${list.listId}`} className={styles.listItem}>
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
        <div
          className={styles.listItem__taskAmount}
          style={{
            backgroundColor: `${listColorTheme[list.colorVariant]}`,
          }}
        >
          {inCompleteTasks.length}
        </div>
        {cloneElement(listIconTheme[list.iconId], {
          size: listStyle === 'grid' ? 130 : 40,
          color: `${listColorTheme[list.colorVariant]}50`,
        })}
        <p>{list.listName === 'Tasks' ? t('tasks') : list.listName}</p>
      </div>
    </Link>
  );
}
