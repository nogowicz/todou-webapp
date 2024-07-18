import React, { useState } from 'react';
import styles from './add-new-task.module.scss';
import { IoClose } from 'react-icons/io5';
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
  const [taskName, setTaskName] = useState('');

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
            />
          </div>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('importance')}</p>
            <CustomSelect<ITaskImportance>
              data={TaskImportanceObject}
              SingleValue={ImportanceSingleValue}
              Option={ImportanceOption}
            />
          </div>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('urgency')}</p>
            <CustomSelect<ITaskUrgency>
              data={TaskUrgencyObject}
              SingleValue={UrgencySingleValue}
              Option={UrgencyOption}
            />
          </div>
          <div className={styles.addNewTask__taskDetails__option}>
            <p>{t('deadline')}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
