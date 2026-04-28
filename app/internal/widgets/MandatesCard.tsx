import { Card, Empty } from './Card';

type Mandate = {
  submittedAt?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  firm?: string;
  assetType?: string;
  status?: string;
  city?: string;
  estValue?: string;
  timeline?: string;
};

async function fetchMandates(): Promise<Mandate[]> {
  const url = process.env.MANDATES_LIST_URL;
  const secret = process.env.MANDATES_LIST_SECRET;
  if (!url) return [];
  try {
    const res = await fetch(url, {
      headers: secret ? { 'x-webhook-secret': secret } : {},
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  } catch {
    return [];
  }
}

export async function MandatesCard() {
  const mandates = await fetchMandates();
  const recent = mandates
    .slice()
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
    .slice(0, 5);
  const total = mandates.length;
  const thisWeek = mandates.filter(m => {
    if (!m.submittedAt) return false;
    return Date.now() - new Date(m.submittedAt).getTime() < 7 * 86400_000;
  }).length;

  return (
    <Card title="Submitted mandates" badge={`${thisWeek} this week · ${total} total`}>
      {recent.length === 0 ? (
        <Empty message="No mandates yet. Once /submit-mandate is wired to n8n, they'll appear here." />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {recent.map((m, i) => (
            <li key={i} style={{ padding: '8px 0', borderBottom: i < recent.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ color: '#fff', fontWeight: 500 }}>
                  {m.fullName || '(no name)'}
                  {m.firm && <span style={{ color: '#888', fontWeight: 400 }}> · {m.firm}</span>}
                </div>
                <div style={{ color: '#888', fontSize: 11 }}>{relativeTime(m.submittedAt)}</div>
              </div>
              <div style={{ color: '#c9a961', fontSize: 12, marginTop: 3 }}>
                {[m.assetType, m.status].filter(Boolean).join(' · ')}
              </div>
              <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>
                {[m.city, m.estValue, m.timeline].filter(Boolean).join(' · ')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function relativeTime(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
