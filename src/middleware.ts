import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/session';
import createMiddleware from 'next-intl/middleware';

async function customMiddleware(req: NextRequest) {
  const protectedRoutes = ['/', '/lists', '/matrix', '/search'];
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
    console.log(verification);
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

export default async function middleware(req: NextRequest) {
  await customMiddleware(req);
  return createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'pl'],

    // Used when no locale matches
    defaultLocale: 'en',
  })(req);
}

export const config = {
  // Merge both matchers
  matcher: [
    '/',
    '/(pl|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
