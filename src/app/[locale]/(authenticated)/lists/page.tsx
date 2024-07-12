import { IList } from '@/types/List';
import { cookies } from 'next/headers';
import getLists from '../../utils/apiCalls/getUsersLists';

export default async function Lists() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value ?? '';

  const lists: IList[] = await getLists(token);

  if (!lists) {
    return <div>Lists not found</div>;
  }

  return (
    <main>
      <div>
        {lists.map((list: IList) => (
          <div key={list.listId}>{list.listName}</div>
        ))}
      </div>
    </main>
  );
}
