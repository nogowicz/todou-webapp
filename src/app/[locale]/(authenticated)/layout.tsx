import Navbar from '@/components/navbar/Navbar';

import styles from './layout.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';
import { getLists } from '@/actions/List';
import { IList } from '@/types/List';
import { ListProvider } from '../utils/Providers/ListProvider';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLists: IList[] = await getLists();
  return (
    <ListProvider initialLists={initialLists}>
      <div className={styles.layoutContainer}>
        <Navbar />
        <div className={styles.layoutContainer__mainContainer}>
          <UserPanel />
          {children}
        </div>
      </div>
    </ListProvider>
  );
}
