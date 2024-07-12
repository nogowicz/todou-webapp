import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from './lib/session';
import createMiddleware from 'next-intl/middleware';

export default async function middleware(req: NextRequest) {
  const locale = req.nextUrl.pathname.split('/')[1];
  const isValidLocale = ['en', 'pl'].includes(locale) ? locale : 'en';
  const protectedRoutes = [
    `/${isValidLocale}`,
    `/${isValidLocale}/lists`,
    `/${isValidLocale}/matrix`,
    `/${isValidLocale}/search`,
  ];
  const loginRoute = `/${isValidLocale}/welcome`;
  const currentPath = req.nextUrl.pathname;
  const cookie = cookies().get('session')?.value;

  console.log('Current path:', currentPath);
  console.log('Locale:', isValidLocale);

  if (protectedRoutes.includes(currentPath)) {
    console.log('Checking session for protected route');
    if (!cookie) {
      console.log(`Session invalid. Redirecting to ${loginRoute}`);
      const redirectUrl = new URL(loginRoute, req.nextUrl.origin).toString();
      console.log('Redirect URL:', redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }

    const verification = await verifySession(cookie);
    console.log(verification);
    if (!verification.isAuth) {
      console.log(`Session invalid. Redirecting to ${loginRoute}`);
      const redirectUrl = new URL(loginRoute, req.nextUrl.origin).toString();
      console.log('Redirect URL:', redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }

    console.log('Session valid. Proceeding to protected route');
  } else if (currentPath === loginRoute) {
    console.log('Checking session for login route');

    if (cookie) {
      const verification = await verifySession(cookie);

      if (verification.isAuth) {
        console.log('Session valid. Redirecting to main page');
        const redirectUrl = new URL(
          `/${isValidLocale}`,
          req.nextUrl.origin
        ).toString();
        console.log('Redirect URL:', redirectUrl);
        return NextResponse.redirect(redirectUrl);
      }
    }

    console.log('No session or session invalid. Proceeding to login route');
  } else {
    console.log('Non-protected route, proceeding');
  }

  const handleI18nRouting = createMiddleware({
    locales: ['en', 'pl'],
    defaultLocale: 'en',
  });
  const response = handleI18nRouting(req);
  return response;
  //  return NextResponse.next();
}

//   return createMiddleware({
// A list of all locales that are supported
// locales: ['en', 'pl'],

// Used when no locale matches
// defaultLocale: 'en',
// })(req);

export const config = {
  // Merge both matchers
  matcher: [
    '/',
    '/(pl|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
