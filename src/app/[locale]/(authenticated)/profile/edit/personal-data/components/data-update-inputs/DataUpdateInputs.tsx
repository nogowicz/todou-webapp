'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import styles from './data-update-inputs.module.scss';
import CustomButton from '@/components/custom-button/CustomButton';
import { FiSave } from 'react-icons/fi';

import { IUser } from '@/types/User';
import CustomInput from '@/components/custom-input/CustomInput';
import { AvatarUploader } from '@/components/avatar-uploader/AvatarUploader';
import { updateUserPhoto } from '@/actions/User';

interface IDataUpdateInputs {
  user: IUser;
}

export default function DataUpdateInputs({ user }: IDataUpdateInputs) {
  const t = useTranslations('Profile');

  async function saveAvatar(url: string) {
    console.log(url);
    await updateUserPhoto(url);
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__upperContainer}>
        <h3>{t('edit-presonal-data')}</h3>
        <CustomButton className={styles.container__upperContainer__button}>
          {t('save')}
          <FiSave />
        </CustomButton>
      </div>
      <div className={styles.container__properties}>
        <AvatarUploader onUploadSuccess={saveAvatar} user={user} />
        <div className={styles.container__properties__inputs}>
          <CustomInput
            label={t('first-name')}
            type="text"
            defaultValue={user.firstName}
            placeholder="John"
          />
          <CustomInput
            label={t('last-name')}
            type="text"
            defaultValue={user.lastName}
            place
            placeholder="Doe"
          />
          <CustomInput
            label={t('email')}
            type="email"
            defaultValue={user.email}
            placeholder="johndoe@todou.com"
          />
        </div>
      </div>
    </div>
  );
}
