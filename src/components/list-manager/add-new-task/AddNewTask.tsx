import React, { cloneElement } from 'react';

import styles from './add-new-task.module.scss';
import { IoClose } from 'react-icons/io5';
import { IList } from '@/types/List';
import { listIconTheme } from '@/components/list-item/ListStyles';
import { Gi3dHammer } from 'react-icons/gi';

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
  if (isVisible) {
    return (
      <div className={styles.addNewTask}>
        <div className={styles.addNewTask__upperContainer}>
          <div className={styles.addNewTask__upperContainer__placeholder} />
          <p>{t('add-new-task')}</p>
          <IoClose onClick={onClose} size={32} />
        </div>
        <div className={styles.addNewTask__taskDetails}>
          <div className={styles.addNewTask__taskDetails__list}>
            List
            <select title="list">
              {lists.map((list: IList, key: number) => (
                <option key={key} value={list.listId}>
                  {cloneElement(listIconTheme[list.iconId], {
                    size: 20,
                    color: 'red',
                  })}
                  <Gi3dHammer color="red" />
                  {list.listName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
