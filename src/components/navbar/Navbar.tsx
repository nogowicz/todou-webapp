'use client';

import React from 'react';
import Link from 'next/link';

import { MdOutlineDoorFront } from 'react-icons/md';
import { GoMoon } from 'react-icons/go';
import { LuSun } from 'react-icons/lu';

import { useUser } from '@/app/utils/Providers/UserProvider';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import { mainMenu } from './links/Links';

import Logo from '../logo/Logo';
import NavbarLink from './navbar-link/NavbarLink';

import styles from './navbar.module.scss';

export default function Navbar() {
  const { mounted, resolvedTheme, setTheme } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';
  const { logout } = useUser();

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
          <p>Main menu</p>
          {mainMenu.map((item, index) => (
            <NavbarLink key={index} href={item.href}>
              {item.icon}
              {item.name}
            </NavbarLink>
          ))}
        </div>
        <div className={styles.navbar__container__fields}>
          <p>Preference</p>
          <NavbarLink
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
          </NavbarLink>
          <NavbarLink
            onClick={() => {
              logout();
            }}
          >
            <MdOutlineDoorFront size={24} />
            Logout
          </NavbarLink>
        </div>
      </div>
    </nav>
  );
}
