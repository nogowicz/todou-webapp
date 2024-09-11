import React, { cloneElement, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import { ESortingType, IList } from '@/types/List';
import { useUser } from '@/utils/Providers/UserProvider';
import { createList, updateList } from '@/actions/List';

import CustomInput from '@/components/custom-input/CustomInput';
import CustomButton from '@/components/custom-button/CustomButton';
import Modal from '@/components/modal/Modal';

import styles from './list-details.module.scss';

interface IListDetails {
  list?: IList;
  isVisible: boolean;
  onClose: () => void;
  handleSubmitList: (list: IList) => void;
}

export default function ListDetails({
  list,
  isVisible,
  onClose,
  handleSubmitList,
}: IListDetails) {
  const t = useTranslations('ListPage');
  const [selectedIcon, setSelectedIcon] = useState(list ? list.iconId : 0);
  const [selectedColor, setSelectedColor] = useState(
    list ? list.colorVariant : 0
  );
  const [listName, setListName] = useState(list ? list.listName : '');
  const { user, token } = useUser();

  const handleSubmitCurrentList = async () => {
    if (!listName || !token || !user) {
      console.log('List name or token is required');
      return;
    }
    if (!list) {
      try {
        const newList: IList = {
          listName: listName,
          iconId: selectedIcon,
          colorVariant: selectedColor,
          task: [],
          canBeDeleted: true,
          createdAt: new Date(),
          createdBy: user.userId,
          isArchived: false,
          isFavorite: false,
          updatedAt: new Date(),
          listId: -1,
          isShared: false,
          sortingType: ESortingType.own,
        };
        handleSubmitList(newList);
        onClose();
        setListName('');
        setSelectedColor(0);
        setSelectedIcon(0);
        await createList(listName, selectedIcon, selectedColor);
      } catch (error) {
        console.error('Error creating new list:', error);
      }
    } else {
      const updatedList: IList = {
        ...list,
        listName: listName,
        iconId: selectedIcon,
        colorVariant: selectedColor,
      };
      onClose();
      handleSubmitList(updatedList);
      await updateList(
        list.listId,
        updatedList.listName,
        updatedList.iconId,
        updatedList.colorVariant
      );
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title={list ? t('edit-list') : t('create-new-list')}
    >
      <CustomInput
        placeholder={t('input-placeholder-list')}
        value={listName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setListName(e.target.value)
        }
      />
      <div>
        <p>{t('select-icon')}</p>
        <div className={styles.iconsContainer}>
          {Object.entries(listIconTheme).map(([key, icon]) => (
            <div
              key={key}
              className={`${styles.iconsContainer__icon} ${
                Number(key) === selectedIcon ? styles.active : ''
              }`}
              onClick={() => setSelectedIcon(parseInt(key, 10))}
            >
              {cloneElement(icon, {
                key: key,
                size: 40,
                color: listColorTheme[selectedColor],
              })}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p>{t('select-color')}</p>
        <div className={styles.colorsContainer}>
          {Object.keys(listColorTheme).map((key) => (
            <div
              key={key}
              className={`${styles.colorsContainer__color} ${
                Number(key) === selectedColor ? styles.active : ''
              }`}
              style={{ backgroundColor: listColorTheme[parseInt(key, 10)] }}
              onClick={() => setSelectedColor(parseInt(key, 10))}
            />
          ))}
        </div>
      </div>
      <CustomButton disabled={!listName} onClick={handleSubmitCurrentList}>
        {list ? t('save-changes') : t('create-new-list')}
      </CustomButton>
    </Modal>
  );
}
