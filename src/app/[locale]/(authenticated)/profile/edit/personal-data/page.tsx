import React from 'react';

import getUser from '@/actions/User';

import DataUpdateInputs from './components/data-update-inputs/DataUpdateInputs';

import styles from './page.module.scss';

export default async function EditPersonalData() {
  const user = await getUser();

  return (
    <div className={styles.page}>
      <DataUpdateInputs user={user} />
    </div>
  );
}
