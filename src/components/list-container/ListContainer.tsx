'use client';
import React, { useOptimistic } from 'react';

import { IList } from '@/types/List';
import ListItem from '../list-item/ListItem';

import styles from './list-container.module.scss';
import ListManager from '../list-manager/ListManager';
import { ITask } from '@/types/Task';

interface IListContainer {
  lists: IList[];
}

export default function ListContainer({ lists }: IListContainer) {
  const [optimisticLists, updateOptimisticLists] = useOptimistic(lists);

  const handleNewList = (newList: IList) => {
    updateOptimisticLists((lists) => [...lists, newList]);
  };

  const handleNewTask = (newTask: ITask) => {
    updateOptimisticLists((lists) => {
      return lists.map((list) => {
        if (list.listId === newTask.listId) {
          return {
            ...list,
            tasks: [...list.task, newTask],
          };
        }
        return list;
      });
    });
  };

  if (!optimisticLists || optimisticLists.length === 0) {
    return <div>No lists found</div>;
  }

  return (
    <>
      <ListManager
        lists={lists}
        handleNewList={handleNewList}
        handleNewTask={handleNewTask}
      />

      <div className={styles.listsContainer}>
        {optimisticLists.map((list: IList) => (
          <ListItem key={list.listId} {...list} />
        ))}
      </div>
    </>
  );
}
