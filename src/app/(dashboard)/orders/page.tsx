import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { desc, eq, and } from 'drizzle-orm';
import { ShoppingBag } from 'lucide-react';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { PageHeader } from '@/components/shared/page-header';
import { OrdersTable } from '@/features/orders/components/orders-table';

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const orgId = session.session.activeOrganizationId;

  const ordersList = orgId
    ? await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.userId, session.user.id),
            eq(orders.organizationId, orgId),
          ),
        )
        .orderBy(desc(orders.createdAt))
        .limit(50)
    : [];

  return (
    <>
      <PageHeader
        title="Orders"
        description={
          orgId
            ? 'Orders for the active organization.'
            : 'Select an organization to view its orders.'
        }
      />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        {!orgId ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-20 text-center text-sm">
            <ShoppingBag className="mb-2 size-10 opacity-30" />
            <p className="tracking-wide">No organization selected.</p>
            <p className="text-xs opacity-60">
              Use the switcher in the sidebar to activate one.
            </p>
          </div>
        ) : (
          <OrdersTable orders={ordersList} />
        )}
      </div>
    </>
  );
}
