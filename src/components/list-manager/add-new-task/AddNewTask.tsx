import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import CustomInput from '@/components/custom-input/CustomInput';
import CustomButton from '@/components/custom-button/CustomButton';
import { createTask } from '@/actions/Task';
import styles from './add-new-task.module.scss';
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

interface IAddNewTask {
  isVisible: boolean;
  onClose: () => void;
  t: Function;
  handleNewTask: (task: ITask) => void;
  lists: IList[];
}

export default function AddNewTask({
  isVisible,
  onClose,
  t,
  handleNewTask,
  lists,
}: IAddNewTask) {
  const currentPath = usePathname();
  const index = Number(currentPath.split('/').pop());
  const list: IList = lists.find((list) => list.listId === index) || lists[0];

  const initialTaskState = {
    title: '',
    subtask: '',
    subtasks: [] as string[],
    currentList: list,
    importance: (TaskImportanceObject[0] as ITaskImportance) || null,
    urgency: (TaskUrgencyObject[0] as ITaskUrgency) || null,
    deadline: null as Date | null,
    note: '',
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
      subtask: [],
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
    let updatedSubtasks = [...task.subtasks];
    if (task.subtask.trim() !== '') {
      updatedSubtasks = [...updatedSubtasks, task.subtask];
      setTask({ ...task, subtasks: updatedSubtasks, subtask: '' });
    }

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

  const addNewSubtask = (subtaskName: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      subtasks: [...prevTask.subtasks, subtaskName],
      subtask: '',
    }));
  };

  const removeSubtask = (index: number) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks.splice(index, 1);
    setTask({ ...task, subtasks: newSubtasks });
  };

  const updateSubtask = (index: number, newSubtask: string) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks[index] = newSubtask;
    setTask({ ...task, subtasks: newSubtasks });
  };

  if (isVisible) {
    return (
      <div className={styles.addNewTask}>
        <div className={styles.addNewTask__upperContainer}>
          <div className={styles.addNewTask__upperContainer__placeholder} />
          <p>{t('add-new-task')}</p>
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
          setUrgency={(urgency: ITaskUrgency) => setTask({ ...task, urgency })}
          date={task.deadline}
          setDate={(deadline: Date | null) => setTask({ ...task, deadline })}
        />
        <div>
          <div className={styles.addNewTask__subtaskInput}>
            <FaPlus size={24} />
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
          <div className={styles.addNewTask__subtasksContainer}>
            {task.subtasks.map((currentSubtask, index) => (
              <Subtask
                key={index}
                index={index}
                subtask={currentSubtask}
                updateSubtask={updateSubtask}
                removeSubtask={removeSubtask}
              />
            ))}
          </div>
        </div>
        <CustomButton disabled={!task.title} onClick={handleAddNewTask}>
          {t('add-new-task')}
        </CustomButton>
      </div>
    );
  }

  return null;
}
