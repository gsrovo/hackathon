import { desc, eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { withAuth } from '@/lib/api/middleware';
import { ok } from '@/lib/api/response';

export const GET = withAuth(async (_req, _ctx, session) => {
  const conditions = [eq(orders.userId, session.user.id)];

  if (session.session.activeOrganizationId) {
    conditions.push(
      eq(orders.organizationId, session.session.activeOrganizationId),
    );
  }

  const ordersList = await db
    .select()
    .from(orders)
    .where(and(...conditions))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return ok(ordersList);
});
