'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import { useMountedTheme } from '@/hooks/useMountedTheme';

import styles from './eisenhower-matrix-icon.module.scss';

export default function EisenhowerMatrixIcon() {
  const { resolvedTheme, mounted } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';
  const currentPathname = usePathname();
  const isActive = currentPathname === '/matrix';
  const combinedClass = [
    styles.iconContainer,
    isActive ? styles.active : '',
  ].join(' ');

  if (!mounted) {
    return null;
  }

  return (
    <div className={combinedClass}>
      <div className={styles.iconContainer__row}>
        <div className={styles.iconContainer__row__block} id={styles.first} />
        <div className={styles.iconContainer__row__block} id={styles.second} />
      </div>
      <div className={styles.iconContainer__row}>
        <div
          className={`${styles.iconContainer__row__block} ${themeClass}`}
          id={styles.third}
        />
        <div className={styles.iconContainer__row__block} id={styles.fourth} />
      </div>
    </div>
  );
}
