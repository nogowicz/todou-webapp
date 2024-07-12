async function getData(token: string) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${BASE_URL}/api/list`, options);
    const lists = await response.json();
    console.log(lists);
    return lists;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

export default async function getLists(token: string) {
  const data = await getData(token);
  return data;
}
