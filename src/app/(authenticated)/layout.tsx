import type { Metadata } from 'next';

import Navbar from '@/components/navbar/Navbar';

import styles from './layout.module.scss';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      {children}
    </div>
  );
}
