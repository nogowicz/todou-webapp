'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { IList } from '@/types/List';
import { ITask } from '@/types/Task';
import { useOptimistic } from 'react';

interface ListContextType {
  optimisticLists: IList[];
  listStyle: 'grid' | 'list';
  setListStyle: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
  handleNewList: (newList: IList) => void;
  handleNewTask: (newTask: ITask) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{
  children: ReactNode;
  initialLists: IList[];
}> = ({ children, initialLists }) => {
  const [optimisticLists, updateOptimisticLists] = useOptimistic(initialLists);
  const [listStyle, setListStyle] = useState<'grid' | 'list'>('grid');

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

  const value = {
    optimisticLists,
    listStyle,
    setListStyle,
    handleNewList,
    handleNewTask,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};

export const useListContext = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useListContext must be used within a ListProvider');
  }
  return context;
};
