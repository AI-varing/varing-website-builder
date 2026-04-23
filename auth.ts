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
    async signIn({ user, account, profile }) {
      console.log('[auth.signIn] user=', JSON.stringify(user));
      console.log('[auth.signIn] account=', JSON.stringify(account));
      console.log('[auth.signIn] profile=', JSON.stringify(profile));
      const email = (profile?.email || (profile as { preferred_username?: string })?.preferred_username || user?.email || '').toLowerCase();
      const allowed = email.endsWith('@' + ALLOWED_DOMAIN);
      console.log('[auth.signIn] resolved email=', email, 'allowed=', allowed);
      return allowed;
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
