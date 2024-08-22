import { listColorTheme } from '@/components/list-item/ListStyles';
import Task from '@/components/task/Task';
import React from 'react';

import styles from './tasks-list.module.scss';
import { ITask } from '@/types/Task';
import { IList } from '@/types/List';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';

interface ITasksList {
  tasks: ITask[];
  list: IList;
  isDndEnabled: boolean;
}

export default function TasksList({ tasks, list, isDndEnabled }: ITasksList) {
  const taskIdentifiers: UniqueIdentifier[] = tasks.map((task) => task.sortId);
  return (
    <SortableContext
      items={taskIdentifiers}
      strategy={verticalListSortingStrategy}
      disabled={!isDndEnabled}
    >
      <div className={styles.container}>
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            primaryColor={listColorTheme[list.colorVariant]}
            isDndEnabled={isDndEnabled}
          />
        ))}
      </div>
    </SortableContext>
  );
}
