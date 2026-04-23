import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

async function fetchPost(slug: string): Promise<Post | null> {
  const url = process.env.INSIGHTS_WEBHOOK_URL;
  if (!url) return null;
  try {
    const res = await fetch(`${url}?status=published&slug=${encodeURIComponent(slug)}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { posts?: Post[] };
    return data.posts?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: 'Insight not found | Targeted Advisors' };
  return {
    title: `${post.title} | Targeted Advisors Insights`,
    description: post.body.split(/\n\n/)[0]?.slice(0, 160) ?? '',
  };
}

export default async function InsightPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 28px' }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/insights" style={{ color: '#c9a961', fontSize: 12, letterSpacing: '0.2em', textDecoration: 'none' }}>
            ← INSIGHTS
          </Link>
        </div>
        <article>
          <h1 style={{ fontSize: 36, fontWeight: 600, margin: 0, lineHeight: 1.15 }}>{post.title}</h1>
          <div style={{ color: '#888', fontSize: 13, marginTop: 12 }}>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </div>
          <div style={{ marginTop: 32, color: '#e5e5e5', fontSize: 16, lineHeight: 1.65 }}>
            {post.body.split(/\n\n/).map((para, i) => (
              <p key={i} style={{ margin: '0 0 18px' }}>{para}</p>
            ))}
          </div>
          {post.sourceUrl && (
            <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #1f1f1f', color: '#888', fontSize: 12 }}>
              Source: <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#c9a961' }}>{post.sourceTitle || post.sourceUrl}</a>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
