import { listColorTheme } from '@/components/list-item/ListStyles';
import Task from '@/components/task/Task';
import React, { useMemo } from 'react';

import styles from './tasks-list.module.scss';
import { ITask } from '@/types/Task';
import { IList } from '@/types/List';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

interface ITasksList {
  tasks: ITask[];
  list: IList;
  isDndEnabled: boolean;
}

export default function TasksList({ tasks, list, isDndEnabled }: ITasksList) {
  let tasksId = useMemo(() => tasks.map((task) => task.taskId), [tasks]);

  return (
    <div className={styles.container}>
      <SortableContext items={tasksId}>
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
            primaryColor={listColorTheme[list.colorVariant]}
            isDndEnabled={isDndEnabled}
          />
        ))}
      </SortableContext>
    </div>
  );
}
