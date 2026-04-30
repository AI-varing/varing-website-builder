import { NextResponse } from 'next/server';

// Auth gate temporarily disabled — Entra app registration / tenant config
// needs reconciling before sign-in works. /internal/* is publicly reachable
// in the meantime.
//
// To restore: replace the body below with the auth() wrapper:
//
//   import { auth } from '@/auth';
//   export default auth((req) => {
//     const { pathname } = req.nextUrl;
//     if (!pathname.startsWith('/internal')) return;
//     if (pathname === '/internal/signin') return;
//     if (!req.auth) {
//       const url = req.nextUrl.clone();
//       url.pathname = '/internal/signin';
//       url.searchParams.set('callbackUrl', pathname);
//       return Response.redirect(url);
//     }
//   });
//   export const config = { matcher: ['/internal/:path*'] };

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
