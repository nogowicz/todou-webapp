import React from 'react';

import styles from './subtask.module.scss';
import { ISubtask } from '@/types/Subtask';
import Checkbox from '../checkbox/Checkbox';
import { updateSubtask } from '@/actions/Subtask';
import { useListContext } from '@/utils/Providers/ListProvider';
import { ITask } from '@/types/Task';

interface SubtaskProps {
  task: ITask;
  subtask: ISubtask;
  primaryColor: string;
}

export default function Subtask({ task, subtask, primaryColor }: SubtaskProps) {
  const { handleUpdateSubtask } = useListContext();
  return (
    <div className={styles.subtaskContainer}>
      <Checkbox
        onClick={async (e) => {
          e.stopPropagation();
          const updatedCompletedSubtask = {
            ...subtask,
            updatedAt: new Date(),
            isCompleted: !subtask.isCompleted,
          };

          handleUpdateSubtask(updatedCompletedSubtask, task);
          await updateSubtask(updatedCompletedSubtask);
        }}
        isCompleted={subtask.isCompleted}
        primaryColor={primaryColor}
      />
      <p
        className={
          subtask.isCompleted ? styles['subtaskContainer--completed'] : ''
        }
      >
        {subtask.title}
      </p>
    </div>
  );
}
