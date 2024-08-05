import React from 'react';

import styles from './not-found.module.scss';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return <div className={styles.notFoundContainer}>{t('list-not-found')}</div>;
}
