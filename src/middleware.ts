import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '../_lib/session';

export default async function middleware(req: NextRequest) {
  const protectedRoutes = ['/', '/dashboard'];
  const unProtectedRoutes = ['/welcome'];
  const currentPath = req.nextUrl.pathname;
  console.log('CURRENT PATH:', currentPath);

  const getSession = async () => {
    const cookie = cookies().get('session')?.value;
    if (cookie) {
      return await decrypt(cookie);
    }
    return null;
  };

  if (protectedRoutes.includes(currentPath)) {
    console.log('Checking session for protected route');
    const session = await getSession();

    if (!session?.userId) {
      console.log('Redirecting to /welcome');
      return NextResponse.redirect(new URL('/welcome', req.nextUrl));
    }
  } else if (unProtectedRoutes.includes(currentPath)) {
    console.log('Checking session for unprotected route');
    const session = await getSession();

    if (session?.userId) {
      console.log('Redirecting to /');
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  } else {
    console.log('Non-protected route, proceeding');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|welcome).*)'], // Ensure to exclude `/welcome`
};
