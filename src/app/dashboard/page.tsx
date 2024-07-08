'use client';

import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';
import { useQuery } from '@tanstack/react-query';
import getLists from '../utils/apiCalls/getUsersLists';
import { IList } from '@/types/List';
import { useUser } from '../utils/Providers/UserProvider';

export default function Home() {
  const { token, logout } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getLists(token ?? ''),
    queryKey: ['lists'],
  });

  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Sorry There was an Error</div>;
  return (
    <main>
      <ThemeSwitch />
      <button
        onClick={() => {
          logout();
        }}
      >
        Log out
      </button>
      <div>
        {data.map((list: IList) => (
          <div key={list.listId}>{list.listName}</div>
        ))}
      </div>
    </main>
  );
}
