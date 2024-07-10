'use client';

import { useQuery } from '@tanstack/react-query';
import { IList } from '@/types/List';
import { useUser } from '../utils/Providers/UserProvider';
import getLists from '../utils/apiCalls/getUsersLists';

export default function Home() {
  const { token } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getLists(token ?? ''),
    queryKey: ['lists'],
  });

  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Sorry There was an Error</div>;
  return (
    <main>
      <div>
        {data.map((list: IList) => (
          <div key={list.listId}>{list.listName}</div>
        ))}
      </div>
    </main>
  );
}
