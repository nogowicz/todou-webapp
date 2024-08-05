import React from 'react';

import styles from './checkbox.module.scss';
import { FaCheck } from 'react-icons/fa';

interface ICheckbox {
  isCompleted: boolean;
  primaryColor: string;
  onClick: () => void;
}

export default function Checkbox({
  isCompleted,
  primaryColor,
  onClick,
}: ICheckbox) {
  return (
    <div
      className={`${styles.checkbox} ${styles.completed}`}
      style={{
        borderColor: primaryColor,
        backgroundColor: isCompleted ? primaryColor : 'transparent',
      }}
      onClick={onClick}
    >
      {isCompleted && <FaCheck />}
    </div>
  );
}
