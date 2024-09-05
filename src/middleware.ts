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
    `/${isValidLocale}/lists/:id`,
    `/${isValidLocale}/matrix`,
    `/${isValidLocale}/search`,
  ];
  const loginRoute = `/${isValidLocale}/welcome`;
  const homeRoute = `/${isValidLocale}`;
  const currentPath = req.nextUrl.pathname;
  const cookie = cookies().get('session')?.value;

  const isProtected = protectedRoutes.some((route) => {
    const routeSegments = route.split('/').filter(Boolean);
    const pathSegments = currentPath.split('/').filter(Boolean);

    if (routeSegments.length !== pathSegments.length) return false;

    return routeSegments.every(
      (segment, index) =>
        segment === pathSegments[index] || segment.startsWith(':')
    );
  });

  if (isProtected) {
    if (!cookie) {
      return NextResponse.redirect(
        new URL(loginRoute, req.nextUrl.origin).toString()
      );
    }

    try {
      const verification = await verifySession(cookie);
      if (!verification.isAuth) {
        return NextResponse.redirect(
          new URL(loginRoute, req.nextUrl.origin).toString()
        );
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      return NextResponse.redirect(
        new URL(loginRoute, req.nextUrl.origin).toString()
      );
    }
  } else if (currentPath === loginRoute) {
    if (cookie) {
      try {
        const verification = await verifySession(cookie);
        if (verification.isAuth) {
          return NextResponse.redirect(
            new URL(homeRoute, req.nextUrl.origin).toString()
          );
        }
      } catch (error) {
        console.error('Error verifying session:', error);
      }
    }
  }

  const handleI18nRouting = createMiddleware({
    locales: ['en', 'pl'],
    defaultLocale: 'en',
  });

  const response = await handleI18nRouting(req);

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(pl|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
