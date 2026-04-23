'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card } from './Card';

type Task = { id: number; userEmail: string; content: string; completed: boolean; createdAt?: string };

export function TasksCard({ email: _email }: { email: string }) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [draft, setDraft] = useState('');
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const res = await fetch('/api/internal/tasks', { cache: 'no-store' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'failed');
      setTasks(data.tasks ?? []);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  useEffect(() => { void load(); }, []);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setDraft('');
    start(async () => {
      const res = await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) await load();
      else setErr('add failed');
    });
  }

  function toggle(t: Task) {
    start(async () => {
      const res = await fetch(`/api/internal/tasks/${t.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ completed: !t.completed }),
      });
      if (res.ok) await load();
      else setErr('toggle failed');
    });
  }

  function remove(t: Task) {
    start(async () => {
      const res = await fetch(`/api/internal/tasks/${t.id}`, { method: 'DELETE' });
      if (res.ok) await load();
      else setErr('delete failed');
    });
  }

  const open = tasks?.filter(t => !t.completed) ?? [];
  const done = tasks?.filter(t => t.completed) ?? [];

  return (
    <Card title="Your tasks" badge={tasks ? `${open.length} open` : '…'}>
      <form onSubmit={add} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task and press enter…"
          disabled={pending}
          style={{
            flex: 1,
            padding: '8px 10px',
            background: '#0a0a0a',
            border: '1px solid #2a2a2a',
            borderRadius: 6,
            color: '#fff',
            fontSize: 13,
          }}
        />
      </form>
      {err && <div style={{ color: '#ff8888', fontSize: 12, marginBottom: 10 }}>error: {err}</div>}
      {tasks === null ? (
        <div style={{ color: '#666', fontSize: 12 }}>loading…</div>
      ) : tasks.length === 0 ? (
        <div style={{ color: '#666', fontSize: 12, fontStyle: 'italic' }}>
          No tasks yet. Add one above.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[...open, ...done].map((t) => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 0',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t)}
                disabled={pending}
                style={{ accentColor: '#c9a961' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: t.completed ? '#666' : '#fff',
                  textDecoration: t.completed ? 'line-through' : 'none',
                }}
              >
                {t.content}
              </span>
              <button
                onClick={() => remove(t)}
                disabled={pending}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: '0 4px',
                }}
                aria-label="Delete task"
                title="Delete"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
