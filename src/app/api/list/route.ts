import {
  createNewList,
  deleteListInDb,
  fetchUsersLists,
  updateList,
} from '@/controllers/List';
import { decrypt } from '../../../lib/session';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }
    const token = authHeader.split(' ')[1];

    const decodedToken = await decrypt(token);

    if (!decodedToken) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 403,
      });
    }

    const result = await fetchUsersLists(token);
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }
    const token = authHeader.split(' ')[1];

    const decodedToken = await decrypt(token);

    if (!decodedToken) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 403,
      });
    }

    const requestData = await request.json();
    const { listName, iconId, colorVariant } = requestData;

    if (
      !listName ||
      typeof iconId !== 'number' ||
      typeof colorVariant !== 'number'
    ) {
      return new Response(JSON.stringify({ message: 'Invalid request body' }), {
        status: 400,
      });
    }

    const newList = await createNewList(token, listName, iconId, colorVariant);

    return new Response(JSON.stringify(newList), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }
    const token = authHeader.split(' ')[1];

    const decodedToken = await decrypt(token);

    if (!decodedToken) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 403,
      });
    }

    const requestData = await request.json();
    const { listId, listName, selectedIcon, selectedColor } = requestData;

    console.log('TEST: ', requestData);

    if (
      !listName ||
      typeof selectedIcon !== 'number' ||
      typeof selectedColor !== 'number'
    ) {
      return new Response(JSON.stringify({ message: 'Invalid request body' }), {
        status: 400,
      });
    }

    const updatedList = await updateList(
      token,
      listId,
      listName,
      selectedIcon,
      selectedColor
    );

    return new Response(JSON.stringify(updatedList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await decrypt(token);

    if (!decodedToken) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const requestData = await request.json();
    const { listId } = requestData;

    if (isNaN(listId)) {
      return new Response(JSON.stringify({ message: 'Invalid list ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deletedList = await deleteListInDb(token, listId);

    if (!deletedList) {
      return new Response(JSON.stringify({ message: 'List not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ message: 'List deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
