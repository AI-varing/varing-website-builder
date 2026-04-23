import { Card, Empty } from './Card';

type DigestSummary = {
  ok: boolean;
  userEmail?: string;
  replies?: number;
  followUps?: number;
  resolved?: number;
  transactional?: number;
  runAt?: string;
  message?: string;
};

async function fetchSummary(email: string): Promise<DigestSummary | null> {
  const url = process.env.DIGEST_SUMMARY_WEBHOOK_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url}?email=${encodeURIComponent(email)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as DigestSummary;
  } catch {
    return null;
  }
}

export async function EmailDigestCard({ email }: { email: string }) {
  const summary = await fetchSummary(email);

  return (
    <Card title="Inbox digest" badge={summary?.runAt ? relativeTime(summary.runAt) : 'this week'}>
      {!summary || !summary.ok ? (
        <Empty message={`No digest yet for ${email}. Run the n8n weekly digest workflow once and this card will populate.`} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Stat label="Replies you owe" value={summary.replies ?? 0} accent />
            <Stat label="Follow-ups to send" value={summary.followUps ?? 0} accent />
            <Stat label="Resolved / FYI" value={summary.resolved ?? 0} />
            <Stat label="Transactional" value={summary.transactional ?? 0} />
          </div>
          <div style={{ marginTop: 14, color: '#666', fontSize: 11 }}>
            From the latest digest run for {summary.userEmail}.
          </div>
        </>
      )}
    </Card>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? '#fff' : '#999' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
