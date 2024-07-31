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

const ICON_SIZE = 50;

export default async function Page({ params }: { params: Params }) {
  const data = await getLists();

  const list: IList = data.find((list: IList) => list.listId === +params.slug);
  if (!list) {
    return notFound();
  }
  const tasks: ITask[] = list.task;

  return (
    <div className={styles.listPage}>
      <div className={styles.listPage__upperContainer}>
        <div className={styles.listPage__upperContainer__leftSide}>
          {cloneElement(listIconTheme[list.iconId], {
            color: listColorTheme[list.colorVariant],
            size: ICON_SIZE,
          })}
          <h3>{list.listName}</h3>
        </div>
        <BsThreeDots size={ICON_SIZE} />
      </div>
      <div className={styles.listPage__tasksContainer}>
        <p>Tasks - {tasks.length}</p>
        <div className={styles.listPage__tasksContainer__tasks}>
          {tasks.map((task) => (
            <Task key={task.taskId} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
