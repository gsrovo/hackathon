import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ShoppingBag, Building2 } from 'lucide-react';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, desc, count, and } from 'drizzle-orm';
import { PageHeader } from '@/components/shared/page-header';
import { StatsCard } from '@/features/dashboard/components/stats-card';
import { RecentOrdersWidget } from '@/features/dashboard/components/recent-orders-widget';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const { user, session: sessionData } = session;
  const activeOrganizationId = sessionData.activeOrganizationId;

  const orderFilter = activeOrganizationId
    ? and(
        eq(orders.userId, user.id),
        eq(orders.organizationId, activeOrganizationId),
      )
    : eq(orders.userId, user.id);

  const [orderCountResult, recentOrders, orgList] = await Promise.all([
    db.select({ count: count() }).from(orders).where(orderFilter),
    db
      .select()
      .from(orders)
      .where(orderFilter)
      .orderBy(desc(orders.createdAt))
      .limit(5),
    auth.api.listOrganizations({ headers: await headers() }),
  ]);

  const orderCount = orderCountResult[0]?.count ?? 0;
  const orgCount = orgList?.length ?? 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name}`}
      />
      <div className="flex flex-1 flex-col gap-8 p-6 lg:p-10">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Orders"
            value={orderCount}
            description={
              activeOrganizationId
                ? 'Orders in the active organization'
                : 'All orders placed under your account'
            }
            icon={ShoppingBag}
          />
          <StatsCard
            title="Organizations"
            value={orgCount}
            description="Organizations you are a member of"
            icon={Building2}
          />
        </div>

        {/* Recent orders */}
        <div className="max-w-2xl">
          <RecentOrdersWidget orders={recentOrders} />
        </div>
      </div>
    </>
  );
}
