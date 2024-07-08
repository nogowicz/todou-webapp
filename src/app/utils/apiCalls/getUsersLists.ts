import axios from 'axios';

async function getData(token: string) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };

  try {
    const response = await axios.get('/api/list', options);
    return response.data;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

export default async function getLists(token: string) {
  const data = await getData(token);
  return data;
}
