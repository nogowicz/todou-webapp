'use client';
import React from 'react';

import styles from './layout.module.scss';
import ListManager from '@/components/list-manager/ListManager';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface IListsLayout {
  lists: React.ReactNode;
  details: React.ReactNode;
}

export default function ListsLayout({ lists, details }: IListsLayout) {
  const currentPathname = usePathname();
  const locale = useLocale();

  const shouldShowDetails = currentPathname !== `/${locale}/lists`;

  return (
    <>
      <ListManager />
      <div className={styles.layoutContainer}>
        <section className={styles.layoutContainer__lists}>{lists}</section>
        {shouldShowDetails && (
          <section className={styles.layoutContainer__details}>
            {details}
          </section>
        )}
      </div>
    </>
  );
}
