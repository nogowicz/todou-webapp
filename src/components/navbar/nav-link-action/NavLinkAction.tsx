'use client';

import React from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';
import { MdOutlineDoorFront } from 'react-icons/md';

import { useMountedTheme } from '@/hooks/useMountedTheme';

import NavbarLink from '../navbar-link/NavbarLink';
import { useTranslations } from 'next-intl';
import { useUser } from '@/utils/Providers/UserProvider';

interface INavLinkAction {
  type: 'logout' | 'theme';
}

export default function NavLinkAction({ type }: INavLinkAction) {
  const { mounted, toggleTheme, resolvedTheme } = useMountedTheme();
  const { logout } = useUser();
  const t = useTranslations('NavigationComponent');

  if (!mounted) {
    return null;
  }
  if (type === 'logout') {
    return (
      <NavbarLink
        onClick={() => {
          logout();
        }}
      >
        <MdOutlineDoorFront size={24} />
        {t('logout')}
      </NavbarLink>
    );
  } else if (type === 'theme') {
    return (
      <NavbarLink
        onClick={() => {
          toggleTheme();
        }}
      >
        {resolvedTheme === 'dark' ? <BiMoon size={24} /> : <BiSun size={24} />}
        {t('change-theme')}
      </NavbarLink>
    );
  }
}
