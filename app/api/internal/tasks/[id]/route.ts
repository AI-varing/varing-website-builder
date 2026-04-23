import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const BASE = process.env.TASKS_WEBHOOK_BASE;

async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session.user.email.toLowerCase();
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const email = await requireSession();
  if (!email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!BASE) return NextResponse.json({ ok: false, error: 'tasks api not configured' }, { status: 500 });

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { completed?: boolean };
  if (typeof body.completed !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'completed boolean required' }, { status: 400 });
  }
  const res = await fetch(`${BASE}-tasks-toggle`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: Number(id), completed: body.completed }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: `upstream ${res.status}` }, { status: 502 });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const email = await requireSession();
  if (!email) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!BASE) return NextResponse.json({ ok: false, error: 'tasks api not configured' }, { status: 500 });

  const { id } = await params;
  const res = await fetch(`${BASE}-tasks-delete`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: Number(id) }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: `upstream ${res.status}` }, { status: 502 });
  const text = await res.text();
  return NextResponse.json(text ? JSON.parse(text) : { ok: true });
}
