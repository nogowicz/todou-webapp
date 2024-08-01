import React from 'react';

import styles from './checkbox.module.scss';
import { FaCheck } from 'react-icons/fa';

interface ICheckbox {
  isCompleted: boolean;
  primaryColor: string;
}

export default function Checkbox({ isCompleted, primaryColor }: ICheckbox) {
  return (
    <div
      className={`${styles.checkbox} ${styles.completed}`}
      style={{
        borderColor: primaryColor,
        backgroundColor: isCompleted ? primaryColor : 'transparent',
      }}
    >
      {isCompleted && <FaCheck />}
    </div>
  );
}
