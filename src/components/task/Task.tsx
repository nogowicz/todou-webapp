'use client';
import { ITask } from '@/types/Task';
import React, { useEffect, useRef, useState } from 'react';

import styles from './task.module.scss';
import { ISubtask } from '@/types/Subtask';
import { GoGitBranch } from 'react-icons/go';
import { IoCalendarOutline } from 'react-icons/io5';
import { useFormatter } from 'next-intl';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Subtask from '../subtask/Subtask';
import Checkbox from '../checkbox/Checkbox';
import { updateTask } from '@/actions/Task';
import { useListContext } from '@/utils/Providers/ListProvider';

interface TaskProps {
  task: ITask;
  primaryColor: string;
}

const ICON_SIZE = 20;

export default function Task({ task, primaryColor }: TaskProps) {
  const format = useFormatter();
  const { handleUpdateTask } = useListContext();
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const [isSubtasksCollapsed, setIsSubtasksCollapsed] = useState(true);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
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
    now.setHours(2);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    if (date === null) return null;
    if (date < now) {
      return styles.pastDeadline;
    } else if (date.toISOString() === now.toISOString()) {
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
                : 'rotate(-180deg)',
              transition: 'transform 0.5s ease-in-out',
            }}
          />
        </div>
      )}
      <div className={styles.taskContainer__main}>
        <Checkbox
          isCompleted={isCompleted}
          primaryColor={primaryColor}
          onClick={async () => {
            setIsCompleted((prev) => !prev);
            const updatedCompletedTask = {
              ...task,
              updatedAt: new Date(),
              isCompleted: !isCompleted,
            };

            handleUpdateTask(updatedCompletedTask);
            await updateTask(updatedCompletedTask);
          }}
        />
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
