import React from 'react';

import styles from './not-found.module.scss';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <div className={styles.notFoundContainer}>
      {t('page-not-found')}
      <Link href="/">
        {t('go-home-link')} <FaArrowRightLong />
      </Link>
    </div>
  );
}
