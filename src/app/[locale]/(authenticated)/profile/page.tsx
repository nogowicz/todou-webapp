import React from 'react';

import styles from './page.module.scss';
import getUser from '@/actions/User';
import Image from 'next/image';
import PlaceholderImg from '../../../../../public/profile-picture-placeholder.jpg';
import { getTranslations } from 'next-intl/server';
import { FiEdit3 } from 'react-icons/fi';
import Link from 'next/link';

export default async function Profile() {
  const user = await getUser();
  const t = await getTranslations('Profile');

  return (
    <div className={styles.page}>
      <div className={styles.page__container}>
        <div className={styles.page__container__upperContainer}>
          <h3>{t('personal-data')}</h3>
          <Link
            href={'/profile/edit/personal-data'}
            className={styles.page__container__upperContainer__button}
          >
            {t('edit')}
            <FiEdit3 />
          </Link>
        </div>
        <div className={styles.page__container__personalData}>
          <Image
            src={user.photoURL ? user.photoURL : PlaceholderImg}
            alt="user photo"
            width={250}
            height={250}
          />
          <div>
            <p className={styles.page__container__personalData__name}>
              {user.firstName} {user.lastName}
            </p>
            <p className={styles.page__container__personalData__email}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.page__container}>
        <div className={styles.page__container__upperContainer}>
          <h3>{t('password')}</h3>
          <Link
            href={'/profile/edit/personal-data'}
            className={styles.page__container__upperContainer__button}
          >
            {t('edit')}
            <FiEdit3 />
          </Link>
        </div>
      </div>
    </div>
  );
}
