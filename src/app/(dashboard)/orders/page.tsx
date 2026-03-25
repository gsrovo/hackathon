import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { PageHeader } from '@/components/shared/page-header';
import { OrdersTable } from '@/features/orders/components/orders-table';

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const ordersList = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return (
    <>
      <PageHeader title="Orders" description="Your order history" />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <OrdersTable orders={ordersList} />
      </div>
    </>
  );
}
