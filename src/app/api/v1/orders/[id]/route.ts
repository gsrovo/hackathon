import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { withUser } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';

export const GET = withUser(async (_req, ctx, session, memberRecord) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.id, id),
        eq(orders.userId, session.user.id),
        eq(orders.organizationId, memberRecord.organizationId),
      ),
    )
    .limit(1);

  if (!order) return err(404, 'Order not found');

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return ok({ ...order, items });
});
