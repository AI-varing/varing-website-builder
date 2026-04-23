import { Card, Empty } from './Card';
import courtOrders from '@/data/court-orders.json';

type CourtOrder = {
  address?: string;
  city?: string;
  area?: string;
  status?: string;
  price?: string;
  detailUrl?: string;
};

export async function CourtOrdersCard() {
  const rows = (courtOrders as CourtOrder[]).slice(0, 6);

  return (
    <Card title="Court-ordered listings" badge={`${(courtOrders as CourtOrder[]).length} active`} href="/internal/court-orders">
      {rows.length === 0 ? (
        <Empty message="No court-ordered listings captured yet." />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {rows.map((r, i) => (
            <li key={i} style={{ padding: '6px 0', borderBottom: i < rows.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ color: '#fff', fontSize: 13 }}>{r.address}</div>
                  <div style={{ color: '#888', fontSize: 11, marginTop: 1 }}>{r.city} · {r.area}</div>
                </div>
                <div style={{ color: '#c9a961', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>{r.price}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
