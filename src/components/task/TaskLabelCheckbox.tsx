import React, { useEffect } from 'react';

import styles from './task-label-checkbox.module.scss';

interface ITaskLabelCheckbox {
  title: string;
  primaryColor: string;
  isCompleted: boolean;
  updateCheckBox: Function;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function TaskLabelCheckbox({
  title,
  primaryColor,
  isCompleted,
  updateCheckBox,
  onClick,
}: ITaskLabelCheckbox) {
  return (
    <div className={styles.taskLabelCheckbox}>
      <input
        type="checkbox"
        name="todo"
        value="todo"
        checked={isCompleted}
        onClick={(e) => {
          updateCheckBox();
          setTimeout(() => {
            onClick(e);
          }, 300);
        }}
        className={styles.checkbox}
        style={{
          borderColor: primaryColor,
          backgroundColor: isCompleted ? primaryColor : 'transparent',
        }}
      />
      <label htmlFor="todo" data-content={title}>
        {title}
      </label>
    </div>
  );
}
