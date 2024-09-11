'use client';
import { ITask } from '@/types/Task';
import React, { useEffect, useRef, useState } from 'react';

import styles from './task.module.scss';
import { ISubtask } from '@/types/Subtask';
import { GoGitBranch } from 'react-icons/go';
import { IoCalendarOutline, IoReorderTwo } from 'react-icons/io5';
import { useFormatter, useTranslations } from 'next-intl';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Subtask from '../subtask/Subtask';
import { updateTask } from '@/actions/Task';
import { useListContext } from '@/utils/Providers/ListProvider';
import TaskManager from '../list-manager/task-manager/TaskManager';
import { BsThreeDots } from 'react-icons/bs';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LabelCheckbox from '../label-checkbox/LabelCheckbox';

interface TaskProps {
  task: ITask;
  primaryColor: string;
  isDndEnabled: boolean;
}

const ICON_SIZE = 20;

export default function Task({ task, primaryColor, isDndEnabled }: TaskProps) {
  const format = useFormatter();
  const t = useTranslations('ListPage');
  const { handleUpdateTask, optimisticLists } = useListContext();
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const [isSubtasksCollapsed, setIsSubtasksCollapsed] = useState(true);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const [maxHeight, setMaxHeight] = React.useState('0px');
  const subtasksRef = useRef<HTMLDivElement>(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.taskId,
    data: { type: 'Task', task },
    disabled: !isDndEnabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    marginBottom: '1rem',
  };

  useEffect(() => {
    if (subtasksRef.current) {
      const { scrollHeight } = subtasksRef.current;
      setMaxHeight(isSubtasksCollapsed ? '0px' : `${scrollHeight}px`);
    }
  }, [isSubtasksCollapsed]);

  useEffect(() => {
    setIsCompleted(task.isCompleted);
  }, [task]);

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

  const updateCheckBox = () => {
    setIsCompleted((prev) => !prev);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          borderColor: primaryColor,
        }}
        className={styles['taskContainer--isDragging']}
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.taskContainer}
      >
        {subtasks.length > 0 && (
          <div
            className={styles.taskContainer__arrow}
            onClick={(e) => {
              e.stopPropagation();
              setIsSubtasksCollapsed((prev) => !prev);
            }}
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
          <div className={styles.taskContainer__main__left}>
            <LabelCheckbox
              title={task.title}
              primaryColor={primaryColor}
              isCompleted={isCompleted}
              updateCheckBox={updateCheckBox}
              onClick={async () => {
                const updatedCompletedTask = {
                  ...task,
                  updatedAt: new Date(),
                  isCompleted: !isCompleted,
                };

                handleUpdateTask(updatedCompletedTask);
                await updateTask(updatedCompletedTask);
              }}
            />
          </div>

          {!isDndEnabled ? (
            <BsThreeDots
              style={{
                marginTop: subtasks.length > 0 ? '20px' : 0,
              }}
              className={styles.taskContainer__main__rightIcon}
              onClick={() => setShowEditTaskModal(true)}
              size={ICON_SIZE * 1.5}
            />
          ) : (
            <IoReorderTwo
              style={{
                marginTop: subtasks.length > 0 ? '20px' : 0,
              }}
              size={ICON_SIZE * 1.5}
            />
          )}
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
                task={task}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        )}
      </div>
      <TaskManager
        isVisible={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
        t={t}
        lists={optimisticLists}
        editedTask={task}
      />
    </>
  );
}
