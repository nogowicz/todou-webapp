'use client';

import React, { useState } from 'react';

import { RiPlayListAddLine } from 'react-icons/ri';
import { BsGrid } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';

import CustomButton from '../custom-button/CustomButton';

import styles from './list-manager.module.scss';
import AddNewList from './add-new-list/AddNewList';
import { useTranslations } from 'next-intl';
import AddNewTask from './add-new-task/AddNewTask';

export default function ListManager({ lists }: any) {
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
      <CustomButton className={styles.listManager__button} variant="secondary">
        <BsGrid size={24} />
        {t('grid')}
      </CustomButton>
      <AddNewList
        isVisible={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        t={t}
      />
      <AddNewTask
        isVisible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        t={t}
        lists={lists}
      />
    </div>
  );
}
