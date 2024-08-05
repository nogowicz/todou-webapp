import React, { cloneElement, useState } from 'react';

import styles from './add-new-list.module.scss';
import { IoClose } from 'react-icons/io5';
import CustomInput from '@/components/custom-input/CustomInput';
import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import CustomButton from '@/components/custom-button/CustomButton';
import { createNewList } from '@/controllers/List';
import { IList } from '@/types/List';
import { useUser } from '@/utils/Providers/UserProvider';

interface IAddNewList {
  isVisible: boolean;
  onClose: () => void;
  handleNewList: (list: IList) => void;
  t: Function;
}

export default function AddNewList({
  isVisible,
  onClose,
  handleNewList,
  t,
}: IAddNewList) {
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [listName, setListName] = useState('');
  const { user, token } = useUser();

  const handleAddNewList = async () => {
    if (!listName || !token || !user) {
      console.log('List name or token is required');
      return;
    }

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
      };
      handleNewList(newList);
      await createNewList(token, listName, selectedIcon, selectedColor);
      onClose();
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  };

  if (isVisible) {
    return (
      <div className={styles.addNewList}>
        <div className={styles.addNewList__upperContainer}>
          <div className={styles.addNewList__upperContainer__placeholder} />
          <p>{t('create-new-list')}</p>
          <IoClose onClick={onClose} size={32} />
        </div>
        <CustomInput
          placeholder={t('input-placeholder-list')}
          value={listName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setListName(e.target.value)
          }
        />
        <div>
          <p>{t('select-icon')}</p>
          <div className={styles.addNewList__iconsContainer}>
            {Object.entries(listIconTheme).map(([key, icon]) => (
              <div
                key={key}
                className={`${styles.addNewList__iconsContainer__icon} ${
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
          <div className={styles.addNewList__colorsContainer}>
            {Object.keys(listColorTheme).map((key) => (
              <div
                key={key}
                className={`${styles.addNewList__colorsContainer__color} ${
                  Number(key) === selectedColor ? styles.active : ''
                }`}
                style={{ backgroundColor: listColorTheme[parseInt(key, 10)] }}
                onClick={() => setSelectedColor(parseInt(key, 10))}
              />
            ))}
          </div>
        </div>
        <CustomButton disabled={!listName} onClick={handleAddNewList}>
          {t('create-new-list')}
        </CustomButton>
      </div>
    );
  }

  return null;
}
