import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import MenuItems from './links/Links';
import NavLinkAction from './nav-link-action/NavLinkAction';
import Logo from '../logo/Logo';

import styles from './navbar.module.scss';

export default function Navbar() {
  const t = useTranslations('NavigationComponent');

  return (
    <nav className={`${styles.navbar}`}>
      <div className={styles.navbar__container}>
        <div className={styles.navbar__container__fields}>
          <Link href={'/'}>
            <Logo width={180} />
          </Link>
          <p>{t('main-menu')}</p>
          <MenuItems />
        </div>
        <div className={styles.navbar__container__fields}>
          <p>{t('preferences')}</p>
          <NavLinkAction type="theme" />
          <NavLinkAction type="logout" />
        </div>
      </div>
    </nav>
  );
}
