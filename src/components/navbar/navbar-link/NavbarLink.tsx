'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMountedTheme } from '@/hooks/useMountedTheme';

import styles from './navbar-link.module.scss';

interface INavbarLink {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function NavbarLink({ children, href, onClick }: INavbarLink) {
  const currentPathname = usePathname();
  const { mounted, resolvedTheme } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';

  const combinedClass = [
    styles.navbarLink,
    themeClass,
    currentPathname === href ? styles.active : '',
  ].join(' ');

  if (!mounted) {
    return null;
  }
  if (href) {
    return (
      <Link className={combinedClass} href={href}>
        {children}
      </Link>
    );
  } else if (onClick) {
    return (
      <div className={combinedClass} onClick={onClick}>
        {children}
      </div>
    );
  }
}
