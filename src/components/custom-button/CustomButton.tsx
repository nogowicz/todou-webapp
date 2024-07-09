'use client';

import React from 'react';
import Link from 'next/link';
import styles from './custom-button.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';

interface ICustomButton {
  children: React.ReactNode;
  href?: string;
  isLoading?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  [key: string]: any;
}

export default function CustomButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  isLoading = false,
  ...props
}: ICustomButton) {
  const { mounted, resolvedTheme } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';

  if (!mounted) {
    return null;
  }

  const variantClass =
    variant === 'secondary' ? styles.secondary : styles.primary;
  const combinedClassName =
    `${styles.button} ${variantClass} ${themeClass} ${className}`.trim();

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
