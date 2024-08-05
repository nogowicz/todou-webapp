import React from 'react';

import styles from './page.module.scss';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import TaskContainer from './components/task-container/TaskContainer';

export default async function Page({ params }: { params: Params }) {
  return (
    <div className={styles.tasksPage}>
      <TaskContainer slug={params.slug} />
    </div>
  );
}
