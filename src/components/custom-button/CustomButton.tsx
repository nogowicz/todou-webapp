'use client';

import React from 'react';
import Link from 'next/link';
import styles from './custom-button.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';

interface ICustomButton {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  [key: string]: any;
}

export default function CustomButton({
  children,
  href,
  onClick,
  className = '',
  isLoading = false,
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
    <button
      disabled={isLoading}
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
