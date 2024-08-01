import React from 'react';

import styles from './subtask.module.scss';
import { ISubtask } from '@/types/Subtask';
import Checkbox from '../checkbox/Checkbox';

interface SubtaskProps {
  subtask: ISubtask;
  primaryColor: string;
}

export default function Subtask({ subtask, primaryColor }: SubtaskProps) {
  return (
    <div className={styles.subtaskContainer}>
      <Checkbox isCompleted={subtask.isCompleted} primaryColor={primaryColor} />
      <p>{subtask.title}</p>
    </div>
  );
}
