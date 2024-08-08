'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { IList } from '@/types/List';
import { ITask } from '@/types/Task';
import { useOptimistic } from 'react';
import { ISubtask } from '@/types/Subtask';

interface ListContextType {
  optimisticLists: IList[];
  handleNewList: (newList: IList) => void;
  handleNewTask: (newTask: ITask) => void;
  handleUpdateTask: (updatedTask: ITask) => void;
  handleUpdateSubtask: (updatedSubtask: ISubtask, currentTask: ITask) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{
  children: ReactNode;
  initialLists: IList[];
}> = ({ children, initialLists }) => {
  const [optimisticLists, updateOptimisticLists] = useOptimistic(initialLists);
  const handleNewList = (newList: IList) => {
    updateOptimisticLists((lists) => [...lists, newList]);
  };

  const handleNewTask = (newTask: ITask) => {
    updateOptimisticLists((lists) => {
      return lists.map((list) => {
        if (list.listId === newTask.listId) {
          return {
            ...list,
            task: [...list.task, newTask],
          };
        }
        return list;
      });
    });
  };

  const handleUpdateTask = (updatedTask: ITask) => {
    updateOptimisticLists((lists) => {
      return lists.map((list) => {
        if (list.listId === updatedTask.listId) {
          return {
            ...list,
            task: list.task.map((task) =>
              task.taskId === updatedTask.taskId ? updatedTask : task
            ),
          };
        }
        return list;
      });
    });
  };

  const handleUpdateSubtask = (
    updatedSubtask: ISubtask,
    currentTask: ITask
  ) => {
    updateOptimisticLists((lists) => {
      return lists.map((list) => {
        if (list.listId === currentTask.listId) {
          const updatedTasks = list.task.map((task) => {
            if (task.taskId === currentTask.taskId) {
              const updatedSubtasks = task.subtask.map((subtask) =>
                subtask.subtaskId === updatedSubtask.subtaskId
                  ? updatedSubtask
                  : subtask
              );

              return {
                ...task,
                subtask: updatedSubtasks,
              };
            }
            return task;
          });

          return {
            ...list,
            task: updatedTasks,
          };
        }
        return list;
      });
    });
  };

  const value = {
    optimisticLists,
    handleNewList,
    handleNewTask,
    handleUpdateTask,
    handleUpdateSubtask,
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
