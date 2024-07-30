import ReactQueryProvider from '../utils/Providers/ReactQueryProvider';
import Navbar from '@/components/navbar/Navbar';

import styles from './layout.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className={styles.layoutContainer}>
        <Navbar />
        <div className={styles.layoutContainer__mainContainer}>
          <UserPanel />
          {children}
        </div>
      </div>
    </ReactQueryProvider>
  );
}
