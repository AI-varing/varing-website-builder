import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const BASE = process.env.TASKS_WEBHOOK_BASE;

async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session.user.email.toLowerCase();
}

export async function GET() {
  const email = await requireSession();
  if (!email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!BASE) return NextResponse.json({ ok: false, error: 'tasks api not configured' }, { status: 500 });

  const res = await fetch(`${BASE}-tasks-list?user=${encodeURIComponent(email)}`, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json({ ok: false, error: `upstream ${res.status}` }, { status: 502 });
  return NextResponse.json(await res.json());
}

export async function POST(req: Request) {
  const email = await requireSession();
  if (!email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!BASE) return NextResponse.json({ ok: false, error: 'tasks api not configured' }, { status: 500 });

  const body = (await req.json().catch(() => ({}))) as { content?: string };
  const content = (body.content ?? '').trim();
  if (!content) return NextResponse.json({ ok: false, error: 'content required' }, { status: 400 });

  const res = await fetch(`${BASE}-tasks-create`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ user: email, content }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: `upstream ${res.status}` }, { status: 502 });
  return NextResponse.json(await res.json());
}
