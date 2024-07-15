'use client';
import { useUser } from '@/app/[locale]/utils/Providers/UserProvider';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import React from 'react';
import NavbarLink from '../navbar-link/NavbarLink';
import { MdOutlineDoorFront } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { BiMoon, BiSun } from 'react-icons/bi';

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
