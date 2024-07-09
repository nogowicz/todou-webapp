import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '../_lib/session';

export default async function middleware(req: NextRequest) {
  const protectedRoutes = ['/', '/dashboard'];
  const loginRoute = '/welcome';
  const currentPath = req.nextUrl.pathname;
  const cookie = cookies().get('session')?.value;

  console.log('Current path:', currentPath);

  if (protectedRoutes.includes(currentPath)) {
    console.log('Checking session for protected route');
    if (!cookie) {
      console.log('No session cookie found. Redirecting to /welcome');
      return NextResponse.redirect(new URL(loginRoute, req.nextUrl));
    }

    const verification = await verifySession(cookie);

    if (!verification.isAuth) {
      console.log('Session invalid. Redirecting to /welcome');
      return NextResponse.redirect(new URL(loginRoute, req.nextUrl));
    }

    console.log('Session valid. Proceeding to protected route');
  } else if (currentPath === loginRoute) {
    console.log('Checking session for login route');

    if (cookie) {
      const verification = await verifySession(cookie);

      if (verification.isAuth) {
        console.log('Session valid. Redirecting to main page');
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
    }

    console.log('No session or session invalid. Proceeding to login route');
  } else {
    console.log('Non-protected route, proceeding');
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
