import { Card, Empty } from './Card';

const DIGEST_ENABLED_FOR = ['ai@varinggroup.com'];

export async function EmailDigestCard({ email }: { email: string }) {
  if (!DIGEST_ENABLED_FOR.includes(email.toLowerCase())) {
    return (
      <Card title="Inbox digest" badge="this week">
        <Empty message="Mailbox not yet connected for your account. Ask Shaurya to extend the digest workflow once tenant-wide Mail.Read is granted." />
      </Card>
    );
  }
  // For now, this surfaces last-known counts. Once we expose a JSON endpoint
  // from the n8n digest workflow (or persist run summaries), it'll go live.
  return (
    <Card title="Inbox digest" badge="this week" href="/internal/inbox">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Stat label="Replies you owe" value="—" />
        <Stat label="Follow-ups to send" value="—" />
        <Stat label="Resolved / FYI" value="—" />
        <Stat label="Transactional" value="—" />
      </div>
      <div style={{ marginTop: 14, color: '#666', fontSize: 11 }}>
        Live counts will populate once the digest workflow exposes a summary endpoint. Last digest was sent today.
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}
