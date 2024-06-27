'use client';

import React from 'react';
import Link from 'next/link';
import styles from './custom-button.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';

interface ICustomButton {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}

export default function CustomButton({
  children,
  href,
  onClick,
  className = '',
  ...props
}: ICustomButton) {
  const { mounted, theme } = useMountedTheme();
  const themeClass = theme ? styles[theme] : '';

  if (!mounted) {
    return null;
  }

  const combinedClassName =
    `${styles.button} ${themeClass} ${className}`.trim();

  if (href) {
    return (
      <Link className={styles.link} href={href} passHref>
        <div className={combinedClassName} {...props}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <button className={combinedClassName} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
