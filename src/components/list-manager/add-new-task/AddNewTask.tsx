import React, { useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import CustomInput from '@/components/custom-input/CustomInput';
import CustomButton from '@/components/custom-button/CustomButton';
import { createTask } from '@/app/[locale]/utils/apiCalls/Task';
import styles from './add-new-task.module.scss';
import TaskDetails from './task-details/TaskDetails';
import Subtask from './subtask/Subtask';
import { IList } from '@/types/List';
import {
  ITaskImportance,
  ITaskUrgency,
  TaskImportanceObject,
  TaskUrgencyObject,
} from '@/types/Task';
import { FaPlus } from 'react-icons/fa';

interface IAddNewTask {
  isVisible: boolean;
  onClose: () => void;
  t: Function;
  lists: IList[];
}

export default function AddNewTask({
  isVisible,
  onClose,
  t,
  lists,
}: IAddNewTask) {
  const initialTaskState = {
    taskName: '',
    subtask: '',
    subtasks: [] as string[],
    currentList: lists[0] as IList,
    importance: (TaskImportanceObject[0] as ITaskImportance) || null,
    urgency: (TaskUrgencyObject[0] as ITaskUrgency) || null,
    date: null as Date | null,
    note: '',
  };
  const [task, setTask] = useState(initialTaskState);

  const subtaskInputRef = useRef<HTMLInputElement>(null);

  const handleAddNewTask = async () => {
    onClose();

    let updatedSubtasks = [...task.subtasks];
    if (task.subtask.trim() !== '') {
      updatedSubtasks = [...updatedSubtasks, task.subtask];
      setTask({ ...task, subtasks: updatedSubtasks, subtask: '' });
    }

    try {
      await createTask(
        task.taskName,
        task.date,
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
          value={task.taskName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTask({ ...task, taskName: e.target.value })
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
          date={task.date}
          setDate={(date: Date | null) => setTask({ ...task, date })}
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
        <CustomButton disabled={!task.taskName} onClick={handleAddNewTask}>
          {t('add-new-task')}
        </CustomButton>
      </div>
    );
  }

  return null;
}
