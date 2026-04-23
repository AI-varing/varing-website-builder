import { Card, Empty } from './Card';

type Item = {
  source: string;
  title: string;
  url: string;
  summary?: string;
  publishedAt?: string;
};

async function fetchActivity(): Promise<Item[]> {
  const url = process.env.MARKET_ACTIVITY_WEBHOOK_URL;
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: Item[] };
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function MarketActivityCard() {
  const items = await fetchActivity();
  return (
    <Card title="Fraser Valley competitors" badge="daily" href="/internal/market-activity">
      {items.length === 0 ? (
        <Empty message="No competitor activity captured yet for Fraser Valley. The poll runs daily at 8am — first new mention will surface here." />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.slice(0, 5).map((it) => (
            <li key={it.url} style={{ padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', fontSize: 13, textDecoration: 'none', display: 'block', lineHeight: 1.35 }}
              >
                {it.title}
              </a>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, color: '#888', fontSize: 11 }}>
                <span>{prettySource(it.source, it.url)}</span>
                <span>·</span>
                <span>{relativeTime(it.publishedAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function prettySource(s: string, url: string): string {
  if (s && s !== 'unknown') return s;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
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
