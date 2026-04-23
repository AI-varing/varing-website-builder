import { auth } from '@/auth';
import { Card, Empty } from './Card';

type DigestStats = {
  followUps: number;
  replies: number;
  receivedAt: string;
};

async function fetchLatestDigest(accessToken: string): Promise<DigestStats | null> {
  // Look for the most recent self-sent "Inbox Digest" email and parse the counts
  // from its subject line. Subject format (set by the n8n digest workflow):
  // "Inbox Digest — 2 follow-ups, 8 replies"
  const params = new URLSearchParams({
    '$filter': "startswith(subject, 'Inbox Digest')",
    '$top': '1',
    '$orderby': 'receivedDateTime desc',
    '$select': 'subject,receivedDateTime',
  });
  const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { value?: Array<{ subject?: string; receivedDateTime?: string }> };
  const latest = data.value?.[0];
  if (!latest?.subject || !latest.receivedDateTime) return null;

  // Extract numbers after "—" separator. "Inbox Digest — 2 follow-ups, 8 replies"
  const fm = latest.subject.match(/(\d+)\s+follow-ups?/i);
  const rm = latest.subject.match(/(\d+)\s+repl(?:y|ies)/i);
  if (!fm && !rm) return null;
  return {
    followUps: fm ? parseInt(fm[1], 10) : 0,
    replies: rm ? parseInt(rm[1], 10) : 0,
    receivedAt: latest.receivedDateTime,
  };
}

export async function EmailDigestCard({ email }: { email: string }) {
  const session = await auth();
  const token = session?.accessToken;
  let stats: DigestStats | null = null;
  let error: string | null = null;
  if (!token) {
    error = 'Sign in again to grant Mail.Read access.';
  } else {
    try {
      stats = await fetchLatestDigest(token);
    } catch (e) {
      error = (e as Error).message;
    }
  }

  return (
    <Card title="Inbox digest" badge="latest">
      {error ? (
        <Empty message={error} />
      ) : !stats ? (
        <Empty message={`No "Inbox Digest" email found for ${email}. Run the n8n digest workflow once — the next digest will populate this card.`} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Stat label="Replies you owe" value={stats.replies} />
            <Stat label="Follow-ups to send" value={stats.followUps} />
          </div>
          <div style={{ marginTop: 14, color: '#666', fontSize: 11 }}>
            Last digest {relativeTime(stats.receivedAt)} · counts parsed from the email subject.
          </div>
        </>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{value}</div>
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
