import React from 'react';
import Modal from '../modal/Modal';
import { IList } from '@/types/List';
import { useTranslations } from 'next-intl';

interface IListSettings {
  isVisible: boolean;
  onClose: () => void;
  list: IList;
}

export default function ListSettings({
  isVisible,
  onClose,
  list,
}: IListSettings) {
  const t = useTranslations('Tasks');
  return (
    <Modal isVisible={isVisible} onClose={onClose} title={t('manage-list')}>
      List Settings
      {/*
        Add user by email,
        Remove users from list,
        Add leave list if u're not owner      
      */}
    </Modal>
  );
}
