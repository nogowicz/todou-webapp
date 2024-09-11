import React from 'react';

import styles from './label-checkbox.module.scss';

interface ILabelCheckbox {
  title: string;
  primaryColor: string;
  isCompleted: boolean;
  updateCheckBox: Function;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LabelCheckbox({
  title,
  primaryColor,
  isCompleted,
  updateCheckBox,
  onClick,
}: ILabelCheckbox) {
  return (
    <div className={styles.labelCheckbox}>
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
