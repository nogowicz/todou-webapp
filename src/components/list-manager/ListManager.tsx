'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';

import { RiPlayListAddLine } from 'react-icons/ri';
import { BsGrid } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';

import CustomButton from '../custom-button/CustomButton';

import styles from './list-manager.module.scss';
import AddNewList from './add-new-list/AddNewList';
import { useTranslations } from 'next-intl';
import AddNewTask from './add-new-task/AddNewTask';
import { IList } from '@/types/List';
import { ITask } from '@/types/Task';
import { CiBoxList } from 'react-icons/ci';
import { MdOutlineSync } from 'react-icons/md';
import { revalidateLists } from '@/actions/List';

interface IListManager {
  lists: IList[];
  handleNewList: (list: IList) => void;
  handleNewTask: (task: ITask) => void;
  listStyle: 'list' | 'grid';
  setListStyle: Dispatch<SetStateAction<'list' | 'grid'>>;
}

export default function ListManager({
  lists,
  handleNewList,
  handleNewTask,
  listStyle,
  setListStyle,
}: IListManager) {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const t = useTranslations('ListPage');

  return (
    <div className={styles.listManager}>
      <CustomButton
        className={styles.listManager__button}
        onClick={() => setShowAddListModal((prev) => !prev)}
      >
        <RiPlayListAddLine size={24} />
        {t('create-new-list')}
      </CustomButton>
      <CustomButton
        className={styles.listManager__button}
        onClick={() => setShowAddTaskModal((prev) => !prev)}
      >
        <FaPlus size={24} />
        {t('add-new-task')}
      </CustomButton>
      <CustomButton
        onClick={() => {
          setListStyle((prev) => (prev === 'grid' ? 'list' : 'grid'));
          localStorage.setItem(
            'listStyle',
            listStyle === 'grid' ? 'list' : 'grid'
          );
        }}
        className={styles.listManager__button}
        variant="secondary"
      >
        {listStyle === 'grid' ? <BsGrid size={24} /> : <CiBoxList size={24} />}
        {t(listStyle)}
      </CustomButton>
      <CustomButton
        className={styles.listManager__button}
        onClick={() => revalidateLists()}
        variant="secondary"
      >
        <MdOutlineSync size={24} />
        {t('sync')}
      </CustomButton>
      <AddNewList
        isVisible={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        handleNewList={handleNewList}
        t={t}
      />
      <AddNewTask
        isVisible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        handleNewTask={handleNewTask}
        t={t}
        lists={lists}
      />
    </div>
  );
}
