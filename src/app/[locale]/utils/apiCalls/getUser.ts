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
    const response = await fetch(`${BASE_URL}/api/user`, options);
    const user = await response.json();
    return user;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

export default async function getUser(token: string) {
  const data = await getData(token);
  return data;
}
