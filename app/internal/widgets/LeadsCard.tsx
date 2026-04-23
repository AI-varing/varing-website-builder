import { Card, Empty } from './Card';

type Lead = {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  timestamp?: string;
  assessed_value?: string;
  result_address?: string;
};

async function fetchLeads(): Promise<Lead[]> {
  const base = process.env.PROPERTY_BOT_URL;
  if (!base) return [];
  try {
    const res = await fetch(`${base}/leads.json`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function LeadsCard({ email: _email }: { email: string }) {
  const leads = await fetchLeads();
  const recent = leads
    .slice()
    .sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''))
    .slice(0, 5);
  const total = leads.length;
  const thisWeek = leads.filter(l => {
    if (!l.timestamp) return false;
    const t = new Date(l.timestamp).getTime();
    return Date.now() - t < 7 * 86400_000;
  }).length;

  return (
    <Card title="Property bot leads" badge={`${thisWeek} this week · ${total} total`}>
      {recent.length === 0 ? (
        <Empty message="No leads found. Check that the property bot Railway service is reachable." />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {recent.map((l, i) => (
            <li key={i} style={{ padding: '8px 0', borderBottom: i < recent.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ color: '#fff', fontWeight: 500 }}>{l.full_name || '(no name)'}</div>
                <div style={{ color: '#888', fontSize: 11 }}>{relativeTime(l.timestamp)}</div>
              </div>
              <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                {l.address || l.result_address || ''}
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
