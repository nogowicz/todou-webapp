'use client';

import React, { useState } from 'react';

import { RiPlayListAddLine } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa';

import CustomButton from '../custom-button/CustomButton';

import styles from './list-manager.module.scss';
import AddNewList from './add-new-list/AddNewList';
import { useTranslations } from 'next-intl';
import TaskManager from './task-manager/TaskManager';
import { MdOutlineSync } from 'react-icons/md';
import { revalidateLists } from '@/actions/List';
import { useListContext } from '@/utils/Providers/ListProvider';

export default function ListManager() {
  const { optimisticLists, handleNewList, handleNewTask } = useListContext();
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
      <TaskManager
        isVisible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        handleNewTask={handleNewTask}
        t={t}
        lists={optimisticLists}
      />
    </div>
  );
}
