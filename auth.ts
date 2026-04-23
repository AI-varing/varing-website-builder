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
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const p = profile as { email?: string; preferred_username?: string; upn?: string; tid?: string } | null;
      const candidates = [user?.email, p?.email, p?.preferred_username, p?.upn]
        .filter(Boolean)
        .map((s) => (s as string).toLowerCase());
      const tenantOk = !p?.tid || p.tid === process.env.AZURE_AD_TENANT_ID;
      const emailOk = candidates.some((c) => c.endsWith('@' + ALLOWED_DOMAIN));
      return emailOk || tenantOk;
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
