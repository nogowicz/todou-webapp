import React, { useEffect, useState } from 'react';

import styles from './subtask.module.scss';
import { ISubtask } from '@/types/Subtask';
import { updateSubtask } from '@/actions/Subtask';
import { useListContext } from '@/utils/Providers/ListProvider';
import { ITask } from '@/types/Task';
import LabelCheckbox from '../label-checkbox/LabelCheckbox';

interface SubtaskProps {
  task: ITask;
  subtask: ISubtask;
  primaryColor: string;
}

export default function Subtask({ task, subtask, primaryColor }: SubtaskProps) {
  const { handleUpdateSubtask } = useListContext();
  const [isCompleted, setIsCompleted] = useState(subtask.isCompleted);

  useEffect(() => {
    setIsCompleted(subtask.isCompleted);
  }, [subtask]);

  const updateCheckBox = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <div className={styles.subtaskContainer}>
      <LabelCheckbox
        title={subtask.title}
        isCompleted={isCompleted}
        updateCheckBox={updateCheckBox}
        primaryColor={primaryColor}
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
      />
    </div>
  );
}
