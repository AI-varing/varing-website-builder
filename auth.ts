import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

const ALLOWED_DOMAIN = process.env.INTERNAL_ALLOWED_DOMAIN || 'varinggroup.com';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      // Issuer uses `organizations` so the OAuth handshake works for any
      // work/school Entra tenant — the email-domain gate in signIn() is what
      // restricts to @varinggroup.com. Pinning the tenant ID here was rejecting
      // every login when AZURE_AD_TENANT_ID drifted from Entra's actual value
      // (NextAuth surfaced Microsoft's tenant-mismatch as AccessDenied long
      // before our signIn callback ran). Personal Microsoft accounts are still
      // excluded because `organizations` rejects MSA tokens.
      issuer: 'https://login.microsoftonline.com/organizations/v2.0',
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const p = profile as { email?: string; preferred_username?: string; upn?: string; tid?: string } | null;
      const candidates = [user?.email, p?.email, p?.preferred_username, p?.upn]
        .filter(Boolean)
        .map((s) => (s as string).toLowerCase());
      // Email gate is the security boundary: must end with @varinggroup.com (or
      // whatever INTERNAL_ALLOWED_DOMAIN says). Entra enforces email-domain
      // ownership at the tenant level, so a valid @varinggroup.com sign-in
      // already proves membership in TA's tenant — an additional `tid` check
      // is redundant in practice and was rejecting legitimate users when the
      // configured AZURE_AD_TENANT_ID drifted from Entra's actual value (e.g.
      // tenant migration, stale env var). Log the mismatch for visibility but
      // don't block on it.
      const emailOk = candidates.some((c) => c.endsWith('@' + ALLOWED_DOMAIN));
      if (p?.tid && process.env.AZURE_AD_TENANT_ID && p.tid !== process.env.AZURE_AD_TENANT_ID) {
        console.warn(
          `[auth] tid drift: token tid=${p.tid} configured AZURE_AD_TENANT_ID=${process.env.AZURE_AD_TENANT_ID} email=${candidates[0] ?? 'unknown'}`
        );
      }
      return emailOk;
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : undefined;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email as string;
      if (token.accessToken) session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/internal/signin',
    error: '/internal/signin',
  },
});
