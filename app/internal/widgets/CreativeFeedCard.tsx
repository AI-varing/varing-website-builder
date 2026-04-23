import { Card } from './Card';

export async function CreativeFeedCard({ email: _email }: { email: string }) {
  // The live pipeline runs weekly and emails a fresh batch with rating links.
  // For now this card surfaces the cadence + inbox pointer; per-user ratings
  // dashboard view requires the feed workflow to publish a summary table.
  const today = new Date();
  const weekOf = startOfWeek(today).toISOString().slice(0, 10);
  return (
    <Card title="Creative feed" badge="weekly · Mon">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#ccc', fontSize: 13 }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 500 }}>Week of {weekOf}</div>
          <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
            10 inspiration references per batch · rated via the digest email
          </div>
        </div>
        <div style={{ color: '#888', fontSize: 12, paddingTop: 6, borderTop: '1px solid #1a1a1a' }}>
          Open the latest <span style={{ color: '#c9a961' }}>Varing Creative Feed</span> email in
          your inbox to rate this week's batch. Live ratings dashboard view is on the roadmap.
        </div>
      </div>
    </Card>
  );
}

function startOfWeek(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  return new Date(d.setDate(diff));
}
