import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights | Targeted Advisors',
  description: 'Commentary on BC distressed real estate, court-ordered listings, and market activity from the Targeted Advisors team.',
};

export const dynamic = 'force-dynamic';

type Post = {
  id: number;
  title: string;
  slug: string;
  body: string;
  status: string;
  publishedAt?: string;
  createdAt?: string;
  sourceUrl?: string;
  sourceTitle?: string;
};

async function fetchPublishedPosts(): Promise<Post[]> {
  const url = process.env.INSIGHTS_WEBHOOK_URL;
  if (!url) return [];
  try {
    const res = await fetch(`${url}?status=published`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: Post[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export default async function InsightsIndex() {
  const posts = await fetchPublishedPosts();

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '60px 28px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#c9a961', marginBottom: 12 }}>TARGETED ADVISORS</div>
          <h1 style={{ fontSize: 42, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>Insights</h1>
          <p style={{ color: '#888', fontSize: 16, marginTop: 16, maxWidth: 560 }}>
            Commentary on BC distressed real estate, court-ordered listings, and market activity that matters for landowners, developers, and lenders.
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={{ color: '#888', fontSize: 14, padding: '48px 0', borderTop: '1px solid #1f1f1f' }}>
            No insights published yet — drafts are auto-generated daily and appear here once approved.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {posts.map((p) => (
              <li key={p.id} style={{ borderTop: '1px solid #1f1f1f', padding: '24px 0' }}>
                <Link href={`/insights/${p.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{p.title}</h2>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </div>
                  <p style={{ color: '#ccc', fontSize: 14, marginTop: 12, lineHeight: 1.55 }}>
                    {firstParagraph(p.body)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function firstParagraph(body: string): string {
  const para = body.split(/\n\n/)[0] ?? body;
  return para.length > 240 ? para.slice(0, 240) + '…' : para;
}
