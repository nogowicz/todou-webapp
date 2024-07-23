import React, { useRef, useState } from 'react';
import { IoCalendarOutline, IoClose } from 'react-icons/io5';
import { IList } from '@/types/List';
import CustomSelect from '@/components/custom-select/CustomSelect';
import CustomInput from '@/components/custom-input/CustomInput';
import {
  ITaskImportance,
  ITaskUrgency,
  TaskImportanceObject,
  TaskUrgencyObject,
} from '@/types/Task';
import {
  ImportanceOption,
  ImportanceSingleValue,
  ListOption,
  ListSingleValue,
  UrgencyOption,
  UrgencySingleValue,
} from './helpers';

import styles from './add-new-task.module.scss';
import { FaPlus } from 'react-icons/fa';
import CustomButton from '@/components/custom-button/CustomButton';
import { useUser } from '@/app/[locale]/utils/Providers/UserProvider';
import { createTask } from '@/app/[locale]/utils/apiCalls/Task';

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
  const { token } = useUser();
  const [taskName, setTaskName] = useState('');
  const [subtask, setSubtask] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [currentList, setCurrentList] = useState<IList | null>(lists[0]);
  const [importance, setImportance] = useState<ITaskImportance | null>(
    TaskImportanceObject[0]
  );
  const [urgency, setUrgency] = useState<ITaskUrgency | null>(
    TaskUrgencyObject[0]
  );
  const [date, setDate] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  const handleDatePickerClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  if (!token || !currentList || !importance || !urgency) {
    return null;
  }

  const handleAddNewTask = async () => {
    if (!token || !currentList) {
      console.log('List id or token is required');
      return;
    }

    try {
      await createTask(
        taskName,
        date,
        importance?.name,
        urgency?.name,
        subtasks,
        currentList?.listId,
        note,
        null
      );
      setTaskName('');
      setDate(null);
      setNote('');
      setImportance(TaskImportanceObject[0]);
      setUrgency(TaskUrgencyObject[0]);
      setSubtask('');
      setSubtasks([]);
      onClose();
    } catch (error) {
      console.error('Error creating new task:', error);
    }
  };

  const addNewSubtask = (subtaskName: string) => {
    setSubtasks([...subtasks, subtaskName]);
  };

  const removeSubtask = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
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
          value={taskName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTaskName(e.target.value)
          }
        />
        <div className={styles.addNewTask__taskDetails}>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('list')}</p>
            <CustomSelect<IList>
              data={lists}
              SingleValue={ListSingleValue}
              Option={ListOption}
              selectedData={currentList}
              setSelectedData={setCurrentList}
            />
          </div>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('importance')}</p>
            <CustomSelect<ITaskImportance>
              data={TaskImportanceObject}
              SingleValue={ImportanceSingleValue}
              Option={ImportanceOption}
              selectedData={importance}
              setSelectedData={setImportance}
            />
          </div>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('urgency')}</p>
            <CustomSelect<ITaskUrgency>
              data={TaskUrgencyObject}
              SingleValue={UrgencySingleValue}
              Option={UrgencyOption}
              selectedData={urgency}
              setSelectedData={setUrgency}
            />
          </div>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('deadline')}</p>
            <div
              className={styles.addNewTask__taskDetails__option__datePicker}
              onClick={handleDatePickerClick}
            >
              <IoCalendarOutline size={40 * 0.8} />
              <input
                placeholder="Pick a date"
                type="date"
                title="deadline"
                ref={dateInputRef}
                value={date?.toISOString().split('T')[0] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDate(new Date(e.target.value))
                }
              />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.addNewTask__subtaskInput}>
            <FaPlus size={24} />
            <input
              title="subtask"
              ref={subtaskInputRef}
              placeholder={t('input-placeholder-subtask')}
              value={subtask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubtask(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  addNewSubtask(subtask);
                  setSubtask('');
                  subtaskInputRef.current?.focus();
                }
              }}
            />
          </div>
          <div className={styles.addNewTask__subtasksContainer}>
            {subtasks.map((currentSubtask, index) => (
              <div
                key={index}
                className={styles.addNewTask__subtasksContainer__subtask}
              >
                <div
                  className={
                    styles.addNewTask__subtasksContainer__subtask__checkbox
                  }
                />
                <input
                  title="subtask"
                  placeholder={t('input-placeholder-subtask')}
                  value={currentSubtask}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSubtasks((prev) => {
                      const newSubtasks = [...prev];
                      newSubtasks[index] = e.target.value;
                      return newSubtasks;
                    })
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      subtaskInputRef.current?.focus();
                    }
                  }}
                />
                <IoClose onClick={() => removeSubtask(index)} size={32} />
              </div>
            ))}
          </div>
        </div>
        <CustomButton disabled={!taskName} onClick={handleAddNewTask}>
          {t('add-new-task')}
        </CustomButton>
      </div>
    );
  }

  return null;
}
