import React from 'react';

import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaChevronDown } from 'react-icons/fa';

import getUser from '@/actions/User';

import styles from './user-panel.module.scss';

import PlaceholderImg from '../../../public/profile-picture-placeholder.jpg';

export default async function UserPanel() {
  const t = await getTranslations('HomePage');
  const data = await getUser();

  return (
    <div className={styles.userPanel}>
      <div className={styles.userPanel__left}>
        <h3 className={styles.userPanel__left__longGreetings}>
          {t('greetings')} {data.firstName}!
        </h3>
        <h3 className={styles.userPanel__left__shortGreetings}>
          {t('greetings-short')} {data.firstName}
        </h3>
        <p>{t('subtitle')}</p>
      </div>
      <div className={styles.userPanel__right}>
        <div className={styles.userPanel__right__user}>
          <Image
            src={PlaceholderImg}
            alt="User photo"
            width={PlaceholderImg.width}
            height={PlaceholderImg.height}
          />
          <p>{data.firstName}</p>
          <FaChevronDown size={24} />
        </div>
      </div>
    </div>
  );
}
