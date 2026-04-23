import { signIn } from '@/auth';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? '/internal';
  const error = params.error;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: 420, width: '90%', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#c9a961', marginBottom: 8 }}>TARGETED ADVISORS</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Internal Dashboard</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 12 }}>Sign in with your varinggroup.com account.</p>
        </div>
        {error && (
          <div style={{
            padding: 12,
            background: 'rgba(220, 60, 60, 0.1)',
            border: '1px solid rgba(220, 60, 60, 0.4)',
            borderRadius: 8,
            color: '#ff8888',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error === 'AccessDenied'
              ? 'Sign-in denied — your email is not on the @varinggroup.com domain.'
              : `Sign-in error: ${error}`}
          </div>
        )}
        <form action={async () => {
          'use server';
          await signIn('microsoft-entra-id', { redirectTo: callbackUrl });
        }}>
          <button type="submit" style={{
            width: '100%',
            padding: '14px 18px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f3f3f3" d="M0 0h23v23H0z" />
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            Sign in with Microsoft
          </button>
        </form>
      </div>
    </div>
  );
}
