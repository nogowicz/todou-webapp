import React from 'react';
import styles from './nav-mobile.module.scss';
import MenuItems from '../links/Links';
import { getTranslations } from 'next-intl/server';

export default async function NavMobile() {
  const t = await getTranslations('NavigationComponent');
  return (
    <div className={styles.nav}>
      <div className={styles.nav__container}>
        <MenuItems t={t} isMobile />
      </div>
    </div>
  );
}
