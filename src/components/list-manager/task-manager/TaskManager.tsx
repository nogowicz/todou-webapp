import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import CustomInput from '@/components/custom-input/CustomInput';
import CustomButton from '@/components/custom-button/CustomButton';
import { createTask, deleteTask, updateTask } from '@/actions/Task';
import styles from './task-manager.module.scss';
import TaskDetails from './task-details/TaskDetails';
import Subtask from './subtask/Subtask';
import { IList } from '@/types/List';
import {
  ITask,
  ITaskImportance,
  ITaskUrgency,
  TaskImportanceObject,
  TaskUrgencyObject,
} from '@/types/Task';
import { FaPlus } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { ISubtask } from '@/types/Subtask';
import { useListContext } from '@/utils/Providers/ListProvider';
import { listColorTheme } from '@/components/list-item/ListStyles';

interface IAddNewTask {
  isVisible: boolean;
  onClose: () => void;
  t: Function;
  lists: IList[];
  editedTask?: ITask;
}

export default function TaskManager({
  isVisible,
  onClose,
  t,
  lists,
  editedTask,
}: IAddNewTask) {
  const currentPath = usePathname();
  const { handleNewTask, handleUpdateTask, handleDeleteTask } =
    useListContext();
  const index = Number(currentPath.split('/').pop());
  const list: IList = lists.find((list) => list.listId === index) || lists[0];
  const modalRef = useRef<HTMLDivElement>(null);
  const editedTaskImportance =
    editedTask?.importance === 'Not important'
      ? TaskImportanceObject[0]
      : TaskImportanceObject[1];
  const editedTaskUrgency =
    editedTask?.urgency === 'Not urgent'
      ? TaskUrgencyObject[0]
      : TaskUrgencyObject[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  const initialTaskState = {
    title: editedTask?.title ?? '',
    subtask: '',
    subtasks: editedTask?.subtask ?? [],
    currentList: list,
    importance: editedTask
      ? (editedTaskImportance as ITaskImportance)
      : (TaskImportanceObject[0] as ITaskImportance),
    urgency: editedTask
      ? (editedTaskUrgency as ITaskUrgency)
      : (TaskUrgencyObject[0] as ITaskUrgency),
    deadline: editedTask?.deadline ?? null,
    note: editedTask?.note ?? '',
  };

  useEffect(() => {
    const index = Number(currentPath.split('/').pop());
    const list = lists.find((list) => list.listId === index) || lists[0];

    setTask((prevTask) => ({
      ...prevTask,
      currentList: list,
    }));
  }, [currentPath, lists]);

  const [task, setTask] = useState(initialTaskState);

  const subtaskInputRef = useRef<HTMLInputElement>(null);

  const handleAddNewTask = async () => {
    const newTask: ITask = {
      title: task.title,
      deadline: task.deadline,
      importance: task.importance.name,
      urgency: task.urgency.name,
      subtask: task.subtasks,
      listId: task.currentList.listId,
      note: task.note,
      addedBy: -1,
      assignedTo: -1,
      createdAt: new Date(),
      isCompleted: false,
      taskId: -1,
      updatedAt: new Date(),
      notificationTime: null,
    };

    handleNewTask(newTask);

    onClose();
    let updatedSubtasks: ISubtask[] = [...task.subtasks];

    if (task.subtask.trim() !== '') {
      const subtaskInInput: ISubtask = {
        title: task.subtask,
        isCompleted: false,
        subtaskId: -1,
        taskId: -1,
        addedBy: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      updatedSubtasks = [...updatedSubtasks, subtaskInInput];
    }
    setTask({ ...task, subtasks: updatedSubtasks, subtask: '' });

    try {
      await createTask(
        task.title,
        task.deadline,
        task.importance.name,
        task.urgency.name,
        updatedSubtasks,
        task.currentList.listId,
        task.note,
        null
      );

      setTask(initialTaskState);
    } catch (error) {
      console.error('Error creating new task:', error);
    }
  };

  const addNewSubtask = (newSubtask: string) => {
    if (newSubtask.trim() === '') return;
    const newSubtaskObject: ISubtask = {
      title: newSubtask,
      isCompleted: false,
      subtaskId: -1,
      taskId: editedTask ? editedTask?.taskId : -1,
      addedBy: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: [...prevTask.subtasks, newSubtaskObject],
      subtask: '',
    }));
  };

  const removeSubtask = (index: number) => {
    if (index < 0 || index >= task.subtasks.length) {
      console.error('Index out of bounds');
      return;
    }

    const newSubtasks = [...task.subtasks];
    newSubtasks.splice(index, 1);
    setTask({ ...task, subtasks: newSubtasks });
  };

  const updateSubtask = (
    index: number,
    newSubtask: string,
    isCompleted: boolean
  ) => {
    if (index < 0 || index >= task.subtasks.length) {
      console.error('Index out of bounds');
      return;
    }

    const updatedSubtasks = task.subtasks.map((subtask, i) =>
      i === index
        ? {
            ...subtask,
            title: newSubtask,
            isCompleted: isCompleted,
            updatedAt: new Date(),
          }
        : subtask
    );

    setTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleUpdateCurrentTask = async () => {
    if (editedTask) {
      const updatedTask: ITask = {
        title: task.title,
        deadline: task.deadline,
        importance: task.importance.name,
        urgency: task.urgency.name,
        subtask: task.subtasks,
        listId: task.currentList.listId,
        note: task.note,
        addedBy: editedTask.addedBy,
        assignedTo: editedTask.assignedTo,
        createdAt: editedTask.createdAt,
        isCompleted: editedTask.isCompleted,
        taskId: editedTask?.taskId,
        updatedAt: new Date(),
        notificationTime: null,
      };

      handleUpdateTask(updatedTask);
      await updateTask(updatedTask);
      onClose();
    }
  };

  const handleDeleteCurrentTask = async () => {
    onClose();
    if (editedTask) {
      handleDeleteTask(editedTask.taskId, editedTask.listId);
      await deleteTask(editedTask?.taskId);
    }
  };

  if (isVisible) {
    return (
      <div className={styles.overlay}>
        <div className={styles.overlay__addNewTask} ref={modalRef}>
          <div className={styles.overlay__addNewTask__upperContainer}>
            <div
              className={
                styles.overlay__addNewTask__upperContainer__placeholder
              }
            />
            <p>{editedTask ? t('edit-task') : t('add-new-task')}</p>
            <IoClose onClick={onClose} size={40} />
          </div>
          <CustomInput
            placeholder={t('input-placeholder-task')}
            value={task.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTask({ ...task, title: e.target.value })
            }
          />
          <TaskDetails
            t={t}
            lists={lists}
            currentList={task.currentList}
            setCurrentList={(list: IList) =>
              setTask({ ...task, currentList: list })
            }
            importance={task.importance}
            setImportance={(importance: ITaskImportance) =>
              setTask({ ...task, importance })
            }
            urgency={task.urgency}
            setUrgency={(urgency: ITaskUrgency) =>
              setTask({ ...task, urgency })
            }
            date={task.deadline}
            setDate={(deadline: Date | null) => setTask({ ...task, deadline })}
          />
          <div>
            <div className={styles.overlay__addNewTask__subtaskInput}>
              <FaPlus
                size={24}
                onClick={() => {
                  addNewSubtask(task.subtask);
                  subtaskInputRef.current?.focus();
                }}
              />
              <input
                title="subtask"
                ref={subtaskInputRef}
                placeholder={t('input-placeholder-subtask')}
                value={task.subtask}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTask({ ...task, subtask: e.target.value })
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    addNewSubtask(task.subtask);
                    subtaskInputRef.current?.focus();
                  }
                }}
              />
            </div>
            <div className={styles.overlay__addNewTask__subtasksContainer}>
              {task.subtasks.map((currentSubtask, index) => (
                <Subtask
                  key={index}
                  index={index}
                  subtask={currentSubtask}
                  updateSubtask={updateSubtask}
                  removeSubtask={removeSubtask}
                  primaryColor={listColorTheme[list.colorVariant]}
                />
              ))}
            </div>
          </div>
          <div className={styles.overlay__addNewTask__buttonsContainer}>
            {editedTask && (
              <CustomButton
                onClick={handleDeleteCurrentTask}
                className={
                  styles.overlay__addNewTask__buttonsContainer__deleteButton
                }
              >
                {t('delete-task')}
              </CustomButton>
            )}
            <CustomButton
              disabled={!task.title}
              onClick={editedTask ? handleUpdateCurrentTask : handleAddNewTask}
            >
              {editedTask ? t('update-task') : t('add-new-task')}
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
