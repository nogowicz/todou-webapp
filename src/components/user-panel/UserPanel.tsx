import React from 'react';

import styles from './user-panel.module.scss';
import { cookies } from 'next/headers';
import { IUser } from '@/types/User';
import getUser from '@/app/[locale]/utils/apiCalls/getUser';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import PlaceholderImg from '../../../public/profile-picture-placeholder.jpg';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaChevronDown } from 'react-icons/fa';

export default async function UserPanel() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value ?? '';
  const resolvedTheme = cookieStore.get('theme')?.value ?? 'dark';
  const t = useTranslations('HomePage');
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';
  const combinedClass = `${styles.userPanel} ${themeClass}`;

  const user: IUser = await getUser(token);

  if (!user) {
    return <div>user not found</div>;
  }
  return (
    <div className={combinedClass}>
      <div className={styles.userPanel__left}>
        <h3>
          {t('greetings')} {user.firstName}!
        </h3>
        <p>{t('subtitle')}</p>
      </div>
      <div className={styles.userPanel__right}>
        <div className={styles.userPanel__right__notification}>
          <IoNotificationsOutline size={32} />
        </div>
        <div className={styles.userPanel__right__user}>
          <Image src={PlaceholderImg} alt="User photo" width={50} height={50} />
          <p>{user.firstName}</p>
          <FaChevronDown size={24} />
        </div>
      </div>
    </div>
  );
}
