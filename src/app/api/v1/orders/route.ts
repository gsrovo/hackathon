import { desc, eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/db/schema';
import { withAuth } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';

export const GET = withAuth(async (_req, _ctx, session) => {
  const orgId = session.session.activeOrganizationId;

  if (!orgId) return ok([]);

  const ordersList = await db
    .select()
    .from(orders)
    .where(
      and(eq(orders.userId, session.user.id), eq(orders.organizationId, orgId)),
    )
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return ok(ordersList);
});

const CreateOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(999),
});

export const POST = withAuth(async (req, _ctx, session) => {
  const orgId = session.session.activeOrganizationId;
  if (!orgId) {
    return err('No active organization. Select an organization first.', 400);
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.errors[0]?.message ?? 'Validation error', 422);
  }

  const { productId, quantity } = parsed.data;

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.organizationId, orgId)))
    .limit(1);

  if (!product) return err('Product not found', 404);

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

  return ok(order, 201);
});
