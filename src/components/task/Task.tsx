import { ITask } from '@/types/Task';
import React from 'react';

import styles from './task.module.scss';
import { FaCheck } from 'react-icons/fa';

interface TaskProps {
  task: ITask;
}

export default function Task({ task }: TaskProps) {
  const completedCheckBoxClass = task.isCompleted
    ? styles.taskContainer__main__checkBox__completed
    : styles.taskContainer__main__checkBox;

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskContainer__main}>
        <div className={completedCheckBoxClass}>
          {task.isCompleted && <FaCheck />}
        </div>
        <div>{task.title}</div>
      </div>
    </div>
  );
}
