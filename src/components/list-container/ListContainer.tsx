'use client';
import React, { useEffect, useOptimistic, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);
  const [listStyle, setListStyle] = useState<'grid' | 'list'>('grid');
  const listModifierClass =
    listStyle === 'grid'
      ? styles.listsContainer__grid
      : styles.listsContainer__list;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedListStyle = localStorage.getItem('listStyle');
      if (storedListStyle) {
        setListStyle(storedListStyle as 'grid' | 'list');
      }
    }
  }, []);

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ListManager
        lists={lists}
        handleNewList={handleNewList}
        handleNewTask={handleNewTask}
        listStyle={listStyle}
        setListStyle={setListStyle}
      />

      <div className={listModifierClass}>
        {optimisticLists.map((list: IList) => (
          <ListItem key={list.listId} list={list} listStyle={listStyle} />
        ))}
      </div>
    </>
  );
}
