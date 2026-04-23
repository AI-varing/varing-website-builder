import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

const ALLOWED_DOMAIN = process.env.INTERNAL_ALLOWED_DOMAIN || 'varinggroup.com';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    }),
  ],
  callbacks: {
    async signIn({ user, account: _account, profile }) {
      // Single-tenant Entra app already restricts sign-in to the varinggroup.com
      // tenant. We additionally allowlist by email/UPN where possible, but
      // accept the user if the tenant matches even when explicit email fields
      // are missing (Entra often returns null `email` for work accounts).
      const p = profile as { email?: string; preferred_username?: string; upn?: string; tid?: string } | null;
      const candidates = [
        user?.email,
        p?.email,
        p?.preferred_username,
        p?.upn,
      ].filter(Boolean).map(s => (s as string).toLowerCase());
      const expectedTenant = process.env.AZURE_AD_TENANT_ID;
      const tenantOk = !p?.tid || p.tid === expectedTenant;
      const emailOk = candidates.some(c => c.endsWith('@' + ALLOWED_DOMAIN));
      console.log('[auth.signIn] candidates=', candidates, 'tenantOk=', tenantOk, 'emailOk=', emailOk);
      // Accept if either an email matches the allowed domain OR the tenant id matches (work-account fallback)
      return emailOk || tenantOk;
    },
    async session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email as string;
      return session;
    },
  },
  logger: {
    error(error) { console.error('[auth.error]', error); },
    warn(code) { console.warn('[auth.warn]', code); },
  },
  pages: {
    signIn: '/internal/signin',
    error: '/internal/signin',
  },
});
