'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

import styles from './eisenhower-matrix-icon.module.scss';

export default function EisenhowerMatrixIcon() {
  const currentPathname = usePathname();
  const locale = useLocale();
  const isActive = currentPathname === `/${locale}/matrix`;
  const combinedClass = [
    styles.iconContainer,
    isActive ? styles.active : '',
  ].join(' ');

  return (
    <div className={combinedClass}>
      <div className={styles.iconContainer__row}>
        <div className={styles.iconContainer__row__block} id={styles.first} />
        <div className={styles.iconContainer__row__block} id={styles.second} />
      </div>
      <div className={styles.iconContainer__row}>
        <div
          className={`${styles.iconContainer__row__block}`}
          id={styles.third}
        />
        <div className={styles.iconContainer__row__block} id={styles.fourth} />
      </div>
    </div>
  );
}
