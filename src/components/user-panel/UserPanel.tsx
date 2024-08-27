import React from 'react';

import { getTranslations } from 'next-intl/server';

import getUser from '@/actions/User';

import styles from './user-panel.module.scss';
import UserContextMenu from './user-context-menu/UserContextMenu';

export default async function UserPanel() {
  const t = await getTranslations('HomePage');
  const user = await getUser();

  return (
    <div className={styles.userPanel}>
      <div className={styles.userPanel__left}>
        <h3 className={styles.userPanel__left__longGreetings}>
          {t('greetings')} {user.firstName}!
        </h3>
        <h3 className={styles.userPanel__left__shortGreetings}>
          {t('greetings-short')} {user.firstName}
        </h3>
        <p>{t('subtitle')}</p>
      </div>
      <div className={styles.userPanel__right}>
        <UserContextMenu user={user} />
      </div>
    </div>
  );
}
