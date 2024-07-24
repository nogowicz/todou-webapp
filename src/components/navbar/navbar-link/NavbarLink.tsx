'use client';

import React from 'react';
import Link from 'next/link';

import styles from './navbar-link.module.scss';
import { usePathname } from 'next/navigation';

interface INavbarLink {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function NavbarLink({ children, href, onClick }: INavbarLink) {
  const currentPathname = usePathname();

  const combinedClass = [
    styles.navbarLink,
    currentPathname === href ? styles.active : '',
  ].join(' ');

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
