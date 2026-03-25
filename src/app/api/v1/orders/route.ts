import { desc, eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { withUser } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';
import { zodFirstIssueMessage } from '@/lib/zod-error-message';

export const GET = withUser(async (_req, _ctx, session, memberRecord) => {
  const ordersList = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.userId, session.user.id),
        eq(orders.organizationId, memberRecord.organizationId),
      ),
    )
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return ok(ordersList);
});

const CreateOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(999),
});

export const POST = withUser(async (req, _ctx, session, memberRecord) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return err(422, zodFirstIssueMessage(parsed.error));
  }

  const { productId, quantity } = parsed.data;
  const orgId = memberRecord.organizationId;

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.organizationId, orgId)))
    .limit(1);

  if (!product) return err(404, 'Product not found');

  const unitPrice = parseFloat(product.price);
  const total = (unitPrice * quantity).toFixed(2);

  const [order] = await db
    .insert(orders)
    .values({
      organizationId: orgId,
      userId: session.user.id,
      status: 'pending',
      totalAmount: total,
      currency: 'USD',
    })
    .returning();

  await db.insert(orderItems).values({
    orderId: order.id,
    productId,
    quantity: String(quantity),
    unitPrice: product.price,
  });

  return ok(order);
});
