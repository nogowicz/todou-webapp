'use client';

import React from 'react';
import Link from 'next/link';
import styles from './custom-button.module.scss';

interface ICustomButton {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
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
  disabled = false,
  ...props
}: ICustomButton) {
  const variantClass =
    variant === 'secondary' ? styles.secondary : styles.primary;
  const combinedClassName =
    `${styles.button} ${variantClass} ${className}`.trim();

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
      disabled={isLoading || disabled}
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
