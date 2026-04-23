import { ReactNode } from 'react';

export function Card({
  title,
  badge,
  children,
  href,
}: {
  title: string;
  badge?: string;
  children: ReactNode;
  href?: string;
}) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #1f1f1f',
      borderRadius: 12,
      padding: 18,
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          {title}
        </h2>
        {badge && (
          <span style={{ fontSize: 10, color: '#c9a961', letterSpacing: '0.1em' }}>{badge}</span>
        )}
      </div>
      <div style={{ flex: 1, color: '#ddd', fontSize: 13 }}>{children}</div>
      {href && (
        <a href={href} style={{ marginTop: 12, color: '#c9a961', fontSize: 12, textDecoration: 'none' }}>
          Open →
        </a>
      )}
    </div>
  );
}

export function Empty({ message }: { message: string }) {
  return <div style={{ color: '#666', fontSize: 13, fontStyle: 'italic' }}>{message}</div>;
}
