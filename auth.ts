import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

const ALLOWED_DOMAIN = process.env.INTERNAL_ALLOWED_DOMAIN || 'varinggroup.com';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = (profile?.email || (profile as { preferred_username?: string })?.preferred_username || '').toLowerCase();
      return email.endsWith('@' + ALLOWED_DOMAIN);
    },
    async session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email as string;
      return session;
    },
  },
  pages: {
    signIn: '/internal/signin',
    error: '/internal/signin',
  },
});
