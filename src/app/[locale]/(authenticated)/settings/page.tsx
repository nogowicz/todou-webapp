import React from 'react';

import styles from './page.module.scss';

export default function page() {
  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        <div className={styles.container__content__title}>
          <h1>Settings</h1>
        </div>
      </div>
    </div>
  );
}
