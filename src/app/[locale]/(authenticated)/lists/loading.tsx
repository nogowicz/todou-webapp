import React from 'react';
import Loader from '@/components/loader/Loader';

import styles from './loading.module.scss';
import { useTranslations } from 'next-intl';

export default function loading() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations('Loader');
  return (
    <div className={styles.container}>
      <Loader />
      <p>{t('loading')}</p>
    </div>
  );
}
