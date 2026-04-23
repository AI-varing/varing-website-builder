import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Internal · Targeted Advisors',
};

export default async function InternalLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const email = session?.user?.email ?? '';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {email && (
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 28px',
          borderBottom: '1px solid #1f1f1f',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Link href="/internal" style={{ textDecoration: 'none', color: '#fff' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: '#c9a961' }}>TARGETED ADVISORS</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Internal Dashboard</div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#888', fontSize: 13 }}>{email}</span>
            <form action={async () => {
              'use server';
              await signOut({ redirectTo: '/internal/signin' });
            }}>
              <button type="submit" style={{
                padding: '6px 12px',
                background: 'transparent',
                color: '#888',
                border: '1px solid #2a2a2a',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
              }}>
                Sign out
              </button>
            </form>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
