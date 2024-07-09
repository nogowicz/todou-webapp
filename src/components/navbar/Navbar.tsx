'use client';

import React from 'react';

import styles from './navbar.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import ThemeSwitch from '../theme-switch/ThemeSwitch';
import { useUser } from '@/app/utils/Providers/UserProvider';
import Logo from '../logo/Logo';
import Link from 'next/link';
import { IoHomeOutline, IoSearch } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import { CiViewList } from 'react-icons/ci';
import { PiMatrixLogoLight } from 'react-icons/pi';
import { LuSun } from 'react-icons/lu';
import { GoMoon } from 'react-icons/go';
import { MdOutlineDoorFront } from 'react-icons/md';

export default function Navbar() {
  const { mounted, resolvedTheme, setTheme } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';
  const { logout } = useUser();
  const currentPathname = usePathname();

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
          <p>MAIN MENU</p>
          <Link
            className={`${styles.navbar__container__fields__link} ${
              currentPathname === '/'
                ? styles.navbar__container__fields__active
                : {}
            }`}
            href="/"
          >
            <IoHomeOutline size={24} />
            Dashboard
          </Link>
          <Link
            className={`${styles.navbar__container__fields__link} ${
              currentPathname === '/lists'
                ? styles.navbar__container__fields__active
                : {}
            }`}
            href="/lists"
          >
            <CiViewList size={24} />
            Lists
          </Link>
          <Link
            className={`${styles.navbar__container__fields__link} ${
              currentPathname === '/matrix'
                ? styles.navbar__container__fields__active
                : {}
            }`}
            href="/matrix"
          >
            <PiMatrixLogoLight size={24} />
            Eisenhower Matrix
          </Link>
          <Link
            className={`${styles.navbar__container__fields__link} ${
              currentPathname === '/search'
                ? styles.navbar__container__fields__active
                : {}
            }`}
            href="/search"
          >
            <IoSearch size={24} />
            Search
          </Link>
        </div>
        <div className={styles.navbar__container__fields}>
          <p>PREFERENCE</p>
          <div
            className={styles.navbar__container__fields__link}
            onClick={() => {
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
            }}
          >
            {resolvedTheme === 'dark' ? (
              <GoMoon size={24} />
            ) : (
              <LuSun size={24} />
            )}
            Change Theme
          </div>
          <div
            className={`${styles.navbar__container__fields__link} ${styles.navbar__container__fields__logout}`}
            onClick={() => {
              logout();
            }}
          >
            <MdOutlineDoorFront size={24} />
            Logout
          </div>
        </div>
      </div>
    </nav>
  );
}
