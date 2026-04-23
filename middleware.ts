import { auth } from '@/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/internal')) return;
  if (pathname === '/internal/signin') return;
  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = '/internal/signin';
    url.searchParams.set('callbackUrl', pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ['/internal/:path*'],
};
