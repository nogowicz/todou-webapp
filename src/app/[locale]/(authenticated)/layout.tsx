import Navbar from '@/components/navbar/Navbar';

import styles from './layout.module.scss';
import UserPanel from '@/components/user-panel/UserPanel';
import { getLists } from '@/actions/List';
import { IList } from '@/types/List';
import ListManager from '@/components/list-manager/ListManager';
import { ListProvider } from '@/utils/Providers/ListProvider';
import NavMobile from '@/components/navbar/nav-mobile/NavMobile';

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
        <NavMobile />
        <div className={styles.layoutContainer__mainContainer}>
          <UserPanel />
          <ListManager />
          {children}
        </div>
      </div>
    </ListProvider>
  );
}
