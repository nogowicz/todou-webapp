'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import Image from 'next/image';

import styles from './data-update-inputs.module.scss';
import CustomButton from '@/components/custom-button/CustomButton';
import { FiEdit3, FiSave } from 'react-icons/fi';

import PlaceholderImg from '../../../../../../../../../public/profile-picture-placeholder.jpg';
import { IUser } from '@/types/User';
import CustomInput from '@/components/custom-input/CustomInput';

interface IDataUpdateInputs {
  user: IUser;
}

export default function DataUpdateInputs({ user }: IDataUpdateInputs) {
  const t = useTranslations('Profile');
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
        <div className={styles.container__properties__image}>
          <Image
            src={user?.photoURL ? user.photoURL : PlaceholderImg}
            alt="user photo"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.container__properties__image__editOverlay}>
            <FiEdit3 />
            Edit Photo
          </div>
        </div>
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
