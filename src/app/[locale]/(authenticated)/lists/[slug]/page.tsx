import React from 'react';

import styles from './page.module.scss';
import { getLists } from '@/actions/List';
import { IList } from '@/types/List';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default async function Page({ params }: { params: Params }) {
  const data = await getLists();

  const currentList = data.find((list: IList) => list.listId === +params.slug);

  if (!currentList) {
    return <div>List not found</div>;
  }

  return <div className={styles.listName}>{currentList.listName}</div>;
}
