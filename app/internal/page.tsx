import { auth } from '@/auth';
import { EmailDigestCard } from './widgets/EmailDigestCard';
import { LeadsCard } from './widgets/LeadsCard';
import { CreativeFeedCard } from './widgets/CreativeFeedCard';
import { CourtOrdersCard } from './widgets/CourtOrdersCard';
import { TasksCard } from './widgets/TasksCard';

export default async function InternalDashboard() {
  const session = await auth();
  const email = session!.user!.email!;
  const firstName = email.split('@')[0].split('.')[0].replace(/^\w/, c => c.toUpperCase());

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 28px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Hi, {firstName}.</h1>
        <p style={{ color: '#888', marginTop: 6, fontSize: 14 }}>
          Your inbox, leads, and the team ops feed. Personal stuff is filtered to you; team data is shared.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
      }}>
        <EmailDigestCard email={email} />
        <LeadsCard email={email} />
        <CreativeFeedCard email={email} />
        <CourtOrdersCard />
        <TasksCard email={email} />
      </div>
    </main>
  );
}
