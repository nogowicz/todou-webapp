'use client';
import { IList } from '@/types/List';
import { ITask } from '@/types/Task';
import { useListContext } from '@/utils/Providers/ListProvider';
import { notFound } from 'next/navigation';
import React, { cloneElement } from 'react';

import styles from './task-container.module.scss';
import ListItem from '@/components/list-item/ListItem';
import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import { BsThreeDots } from 'react-icons/bs';
import Task from '@/components/task/Task';
import { useTranslations } from 'next-intl';

interface ITaskContainer {
  slug: string;
}

const ICON_SIZE = 50;

export default function TaskContainer({ slug }: ITaskContainer) {
  const { optimisticLists } = useListContext();
  const t = useTranslations('Tasks');

  const list: IList | undefined = optimisticLists.find(
    (list: IList) => list.listId === +slug
  );
  if (!list) {
    return notFound();
  }
  const tasks: ITask[] = list.task;
  const inCompleteTasks: ITask[] = tasks.filter((task) => !task.isCompleted);
  const completedTasks: ITask[] = tasks.filter((task) => task.isCompleted);
  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskContainer__left}>
        <div className={styles.taskContainer__left__listsContainer}>
          {optimisticLists.map((list: IList) => (
            <ListItem list={list} listStyle="list" key={list.listId} />
          ))}
        </div>
      </div>
      <div className={styles.taskContainer__right}>
        <div className={styles.taskContainer__right__upperContainer}>
          <div
            className={styles.taskContainer__right__upperContainer__leftSide}
          >
            {cloneElement(listIconTheme[list.iconId], {
              color: listColorTheme[list.colorVariant],
              size: ICON_SIZE,
            })}
            <h3>{list.listName === 'Tasks' ? t('tasks') : list.listName}</h3>
          </div>
          <BsThreeDots size={ICON_SIZE} />
        </div>
        <div className={styles.taskContainer__right__tasksContainer}>
          <p>
            {t('tasks')} - {inCompleteTasks.length}
          </p>
          <div className={styles.taskContainer__right__tasksContainer__tasks}>
            {inCompleteTasks.map((task) => (
              <Task
                key={task.taskId}
                task={task}
                primaryColor={listColorTheme[list.colorVariant]}
              />
            ))}
          </div>
        </div>
        {completedTasks.length > 0 && (
          <div className={styles.taskContainer__right__tasksContainer}>
            <p>
              {t('completed')} - {completedTasks.length}
            </p>
            <div className={styles.taskContainer__right__tasksContainer__tasks}>
              {completedTasks.map((task) => (
                <Task
                  key={task.taskId}
                  task={task}
                  primaryColor={listColorTheme[list.colorVariant]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
