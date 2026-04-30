// Auth gate temporarily disabled — Entra app registration / tenant config
// needs reconciling before sign-in works. /internal/* is publicly reachable
// in the meantime; the email-domain check in auth.ts is also bypassed because
// the middleware redirect to /internal/signin is what was forcing the OAuth
// round-trip in the first place.
//
// To restore: uncomment the auth() wrapper below, re-add `'/internal/:path*'`
// to the matcher, and (in auth.ts) restore the @varinggroup.com gate.
//
// import { auth } from '@/auth';
//
// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   if (!pathname.startsWith('/internal')) return;
//   if (pathname === '/internal/signin') return;
//   if (!req.auth) {
//     const url = req.nextUrl.clone();
//     url.pathname = '/internal/signin';
//     url.searchParams.set('callbackUrl', pathname);
//     return Response.redirect(url);
//   }
// });

// Empty matcher = middleware never runs. Cleaner than deleting the file
// because the next-auth handler import still resolves and we keep a clean
// re-enable path.
export const config = {
  matcher: [] as string[],
};
