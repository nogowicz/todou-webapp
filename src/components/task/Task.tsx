'use client';
import { ITask } from '@/types/Task';
import React, { useEffect, useRef } from 'react';

import styles from './task.module.scss';
import { FaCheck } from 'react-icons/fa';
import { ISubtask } from '@/types/Subtask';
import { GoGitBranch } from 'react-icons/go';
import { IoCalendarOutline } from 'react-icons/io5';
import { useFormatter } from 'next-intl';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Checkbox from '../checkbox/CheckBox';
import Subtask from '../subtask/Subtask';

interface TaskProps {
  task: ITask;
  primaryColor: string;
}

const ICON_SIZE = 20;

export default function Task({ task, primaryColor }: TaskProps) {
  const format = useFormatter();
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const [isSubtasksCollapsed, setIsSubtasksCollapsed] = React.useState(true);
  const [maxHeight, setMaxHeight] = React.useState('0px');
  const subtasksRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (subtasksRef.current) {
      const { scrollHeight } = subtasksRef.current;
      setMaxHeight(isSubtasksCollapsed ? '0px' : `${scrollHeight}px`);
    }
  }, [isSubtasksCollapsed]);

  const deadlineColor = (date: Date | null) => {
    const now = new Date();
    if (date === null) return null;
    if (date < now) {
      return styles.pastDeadline;
    } else if (date.toDateString() === now.toDateString()) {
      return styles.today;
    } else {
      return styles.upcoming;
    }
  };

  const deadlineColorClass = deadlineColor(deadlineDate);

  const deadline = deadlineDate
    ? format.dateTime(deadlineDate, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'No deadline set';

  const subtasks: ISubtask[] = task.subtask;
  const completedSubtasks = subtasks.filter((subtask) => subtask.isCompleted);

  return (
    <div className={styles.taskContainer}>
      {subtasks.length > 0 && (
        <div
          className={styles.taskContainer__arrow}
          onClick={() => setIsSubtasksCollapsed((prev) => !prev)}
        >
          <MdKeyboardArrowDown
            size={ICON_SIZE * 1.5}
            style={{
              transform: isSubtasksCollapsed
                ? 'rotate(0deg)'
                : 'rotate(180deg)',
              transition: 'transform 0.5s ease-in-out',
            }}
          />
        </div>
      )}
      <div className={styles.taskContainer__main}>
        <Checkbox isCompleted={task.isCompleted} primaryColor={primaryColor} />
        <p>{task.title}</p>
      </div>
      <div className={styles.taskContainer__details}>
        {subtasks.length > 0 && (
          <div className={styles.taskContainer__details__detail}>
            <GoGitBranch
              size={ICON_SIZE}
              style={{
                transform: 'scale(1, -1)',
              }}
            />
            {completedSubtasks.length} / {subtasks.length}
          </div>
        )}
        {deadlineDate && (
          <div
            className={`${styles.taskContainer__details__detail}  ${deadlineColorClass}`}
          >
            <IoCalendarOutline size={ICON_SIZE} />
            {deadline}
          </div>
        )}
      </div>
      {subtasks.length > 0 && (
        <div
          className={styles.taskContainer__subtasks}
          style={{ maxHeight: maxHeight }}
          ref={subtasksRef}
        >
          {subtasks.map((subtask) => (
            <Subtask
              key={subtask.subtaskId}
              subtask={subtask}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
