import { Card, Empty } from './Card';

export async function TasksCard({ email: _email }: { email: string }) {
  // V1 placeholder. Tasks persist in Vercel KV / Postgres once we pick a store;
  // for now this is where per-user todos will live.
  return (
    <Card title="Your tasks" badge="personal">
      <Empty message="Todo list lives here. Needs a persistence layer (Vercel KV or Neon). Add once it's wired up." />
    </Card>
  );
}
