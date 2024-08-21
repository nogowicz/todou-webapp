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
}

export default function TasksList({ tasks, list }: ITasksList) {
  const taskIdentifiers: UniqueIdentifier[] = tasks.map((task) => task.taskId);
  return (
    <div className={styles.container}>
      <SortableContext
        items={taskIdentifiers}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            primaryColor={listColorTheme[list.colorVariant]}
          />
        ))}
      </SortableContext>
    </div>
  );
}
