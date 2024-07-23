import ReactQueryProvider from '../utils/Providers/ReactQueryProvider';
import Navbar from '@/components/navbar/Navbar';

import styles from './layout.module.scss';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className={styles.layoutContainer}>
        <Navbar />
        {children}
      </div>
    </ReactQueryProvider>
  );
}
