'use client';

import React, { Dispatch, SetStateAction } from 'react';

import styles from './pagination.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import { IPages } from '../forms/sign-up/SignUpForm';

interface IPagination {
  pages: IPages[];
  activePage: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  pages,
  activePage,
  setPage,
}: IPagination) {
  const { mounted, resolvedTheme } = useMountedTheme();
  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';

  if (!mounted) {
    return null;
  }
  return (
    <div className={`${styles.pagination}  ${themeClass}`}>
      {pages.map((page: IPages, index: number) => (
        <div
          onClick={() => setPage(index)}
          key={page.id}
          className={`${styles.pagination__dot} ${
            index === activePage ? styles.pagination__dot__active : {}
          }`}
        />
      ))}
    </div>
  );
}
