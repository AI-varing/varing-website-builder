import { Card, Empty } from './Card';

export async function CreativeFeedCard({ email: _email }: { email: string }) {
  // V1: placeholder that links to the feed folder. Wire to a real "latest batch +
  // your rating progress" endpoint once the creative-feed workflow persists
  // per-user state.
  return (
    <Card title="Creative feed" badge="weekly" href="/internal/creative-feed">
      <Empty message="Latest batch and your rating progress will show here once the feed workflow persists per-user state. For now, check your inbox for the weekly digest." />
    </Card>
  );
}
