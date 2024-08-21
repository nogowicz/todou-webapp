'use client';
import { IList } from '@/types/List';
import { ITask } from '@/types/Task';
import { useListContext } from '@/utils/Providers/ListProvider';
import { notFound } from 'next/navigation';
import React, { cloneElement, useCallback, useRef, useState } from 'react';

import styles from './task-container.module.scss';
import ListItem from '@/components/list-item/ListItem';
import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import { BsSortUp, BsThreeDots } from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import ContextMenu, { IItems } from '@/components/context-menu/ContextMenu';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { IoMdReorder } from 'react-icons/io';
import { GoPeople } from 'react-icons/go';
import {
  RiDeleteBin6Line,
  RiInboxArchiveLine,
  RiInboxUnarchiveLine,
} from 'react-icons/ri';
import ListDetails from '@/components/list-manager/list-details/ListDetails';
import {
  deleteCompletedTasksInList,
  deleteList,
  updateList,
} from '@/actions/List';
import { useUser } from '@/utils/Providers/UserProvider';

import TasksList from './tasks-list/TasksList';
import { closestCorners, DndContext } from '@dnd-kit/core';
interface ITaskContainer {
  slug: string;
}

const ICON_SIZE = 50;

export default function TaskContainer({ slug }: ITaskContainer) {
  const { optimisticLists, handleUpdateList } = useListContext();
  const [contextMenuVisibility, setContextMenuVisibility] = useState(false);
  const [listDetailsVisibility, setListDetailsVisibility] = useState(false);
  const { user } = useUser();
  const iconRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Tasks');
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const optimisticListUnArchived = optimisticLists.filter(
    (list: IList) => !list.isArchived
  );

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const x = rect.left - 250;
      const y = rect.top + 40;

      setContextMenuPosition({ x, y });
      setContextMenuVisibility(true);
    }
  }, []);

  const list: IList | undefined = optimisticLists.find(
    (list: IList) => list.listId === +slug
  );
  if (!list) {
    return notFound();
  }
  const tasks: ITask[] = list.task;
  const inCompleteTasks: ITask[] = tasks.filter((task) => !task.isCompleted);
  const completedTasks: ITask[] = tasks.filter((task) => task.isCompleted);

  const menuItems: IItems[] = [
    {
      label: t('edit-list'),
      icon: <AiOutlineEdit />,
      onClick: () => setListDetailsVisibility(true),
      isActive: list.listId !== user?.idDefaultList,
    },
    {
      label: t('sort-list'),
      icon: <BsSortUp />,
      onClick: () => console.log('Sort List clicked'),
      isActive: true,
    },
    {
      label: t('delete-completed-tasks'),
      icon: <MdOutlineDeleteForever />,
      onClick: () => deleteCompletedTasksInList(list.listId),
      isActive: completedTasks.length > 0,
    },
    {
      label: t('change-order'),
      icon: <IoMdReorder />,
      onClick: () => console.log('Change Order clicked'),
      isActive: true,
    },
    {
      label: list.isArchived ? t('unarchive-list') : t('archive-list'),
      icon: list.isArchived ? <RiInboxUnarchiveLine /> : <RiInboxArchiveLine />,
      onClick: list.isArchived
        ? () => {
            const updatedList: IList = {
              ...list,
              isArchived: false,
            };
            handleUpdateList(updatedList);
            updateList(
              list.listId,
              undefined,
              undefined,
              undefined,
              false,
              undefined
            );
          }
        : () => {
            const updatedList: IList = {
              ...list,
              isArchived: true,
            };
            handleUpdateList(updatedList);
            updateList(
              list.listId,
              undefined,
              undefined,
              undefined,
              true,
              undefined
            );
          },
      isActive: list.listId !== user?.idDefaultList,
    },
    {
      label: t('invite-collaborators'),
      icon: <GoPeople />,
      onClick: () => console.log('Invite Collaborators clicked'),
      isActive: list.listId !== user?.idDefaultList,
    },
    {
      label: t('delete-list'),
      icon: <RiDeleteBin6Line />,
      onClick: () => deleteList(list.listId),
      color: '#D82A38',
      isActive: list.listId !== user?.idDefaultList,
    },
  ];

  // const handleDragEnd = (result: DropResult) => {
  //   console.log('result', result);
  //   // const { source, destination } = result;
  //   // if (!destination) return;
  // };

  return (
    <DndContext collisionDetection={closestCorners}>
      <div className={styles.taskContainer}>
        <div className={styles.taskContainer__left}>
          <div className={styles.taskContainer__left__listsContainer}>
            {optimisticListUnArchived.map((list: IList) => (
              <ListItem list={list} listStyle="list" key={list.listId} />
            ))}
          </div>
        </div>
        <div className={styles.taskContainer__right}>
          <div className={styles.taskContainer__right__upperContainer}>
            <div
              className={styles.taskContainer__right__upperContainer__leftSide}
            >
              {cloneElement(listIconTheme[list.iconId], {
                color: listColorTheme[list.colorVariant],
                size: ICON_SIZE,
              })}
              <h3>{list.listName === 'Tasks' ? t('tasks') : list.listName}</h3>
            </div>
            <div
              className={styles.taskContainer__right__upperContainer__rightSide}
              ref={iconRef}
            >
              <BsThreeDots
                size={ICON_SIZE}
                onClick={(event: any) => handleContextMenu(event)}
              />
            </div>
          </div>

          <div className={styles.taskContainer__right__tasksContainer}>
            <p className={styles.taskContainer__right__tasksContainer__tittle}>
              {t('tasks')} - {inCompleteTasks.length}
            </p>
            <TasksList tasks={inCompleteTasks} list={list} />
          </div>
          {completedTasks.length > 0 && (
            <div className={styles.taskContainer__right__tasksContainer}>
              <p
                className={styles.taskContainer__right__tasksContainer__tittle}
              >
                {t('completed')} - {completedTasks.length}
              </p>
              <TasksList tasks={completedTasks} list={list} />
            </div>
          )}
        </div>
        <ContextMenu
          items={menuItems}
          visible={contextMenuVisibility}
          setVisible={setContextMenuVisibility}
          position={contextMenuPosition}
        />

        <ListDetails
          list={list}
          isVisible={listDetailsVisibility}
          onClose={() => setListDetailsVisibility(false)}
          handleSubmitList={handleUpdateList}
        />
      </div>
    </DndContext>
  );
}
