import React, { cloneElement } from 'react';

import styles from './page.module.scss';
import { getLists } from '@/actions/List';
import { IList } from '@/types/List';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import { BsThreeDots } from 'react-icons/bs';
import { ITask } from '@/types/Task';
import Task from '@/components/task/Task';
import { notFound } from 'next/navigation';
import ListItem from '@/components/list-item/ListItem';
import { getTranslations } from 'next-intl/server';

const ICON_SIZE = 50;

export default async function Page({ params }: { params: Params }) {
  const data = await getLists();
  const t = await getTranslations('Tasks');

  const list: IList = data.find((list: IList) => list.listId === +params.slug);
  if (!list) {
    return notFound();
  }
  const tasks: ITask[] = list.task;

  return (
    <div className={styles.listPage}>
      <div className={styles.listPage__left}>
        <div className={styles.listPage__left__listsContainer}>
          {data.map((list: IList) => (
            <ListItem list={list} listStyle="list" key={list.listId} />
          ))}
        </div>
      </div>
      <div className={styles.listPage__right}>
        <div className={styles.listPage__right__upperContainer}>
          <div className={styles.listPage__right__upperContainer__leftSide}>
            {cloneElement(listIconTheme[list.iconId], {
              color: listColorTheme[list.colorVariant],
              size: ICON_SIZE,
            })}
            <h3>{list.listName === 'Tasks' ? t('tasks') : list.listName}</h3>
          </div>
          <BsThreeDots size={ICON_SIZE} />
        </div>
        <div className={styles.listPage__right__tasksContainer}>
          <p>
            {t('tasks')} - {tasks.length}
          </p>
          <div className={styles.listPage__right__tasksContainer__tasks}>
            {tasks.map((task) => (
              <Task
                key={task.taskId}
                task={task}
                primaryColor={listColorTheme[list.colorVariant]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
