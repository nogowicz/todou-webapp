'use client';

import React, { Dispatch, SetStateAction } from 'react';

import { IPages } from '../forms/sign-up/SignUpForm';

import styles from './pagination.module.scss';

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
  return (
    <div className={`${styles.pagination}`}>
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
