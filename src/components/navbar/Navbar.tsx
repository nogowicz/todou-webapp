'use client';

import React from 'react';
import Link from 'next/link';

import { MdOutlineDoorFront } from 'react-icons/md';
import { GoMoon } from 'react-icons/go';
import { LuSun } from 'react-icons/lu';

import { useMountedTheme } from '@/hooks/useMountedTheme';

import Logo from '../logo/Logo';
import NavbarLink from './navbar-link/NavbarLink';

import styles from './navbar.module.scss';
import { useUser } from '@/app/[locale]/utils/Providers/UserProvider';
import useMainMenu from './links/Links';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const { mounted, resolvedTheme, toggleTheme } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';
  const { logout } = useUser();
  const mainMenu = useMainMenu();
  const t = useTranslations('NavigationComponent');

  if (!mounted) {
    return null;
  }

  return (
    <nav className={`${styles.navbar} ${themeClass}`}>
      <div className={styles.navbar__container}>
        <div className={styles.navbar__container__fields}>
          <Link href={'/'}>
            <Logo width={180} />
          </Link>
          <p>{t('main-menu')}</p>
          {mainMenu.map((item, index) => (
            <NavbarLink key={index} href={item.href}>
              {item.icon}
              {item.name}
            </NavbarLink>
          ))}
        </div>
        <div className={styles.navbar__container__fields}>
          <p>{t('preferences')}</p>
          <NavbarLink onClick={toggleTheme}>
            {resolvedTheme === 'dark' ? (
              <GoMoon size={24} />
            ) : (
              <LuSun size={24} />
            )}
            {t('change-theme')}
          </NavbarLink>
          <NavbarLink
            onClick={() => {
              logout();
            }}
          >
            <MdOutlineDoorFront size={24} />
            {t('logout')}
          </NavbarLink>
        </div>
      </div>
    </nav>
  );
}
