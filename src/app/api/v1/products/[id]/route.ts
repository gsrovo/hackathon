import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { withAuth } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';

const UpdateProductBodySchema = z.object({
  name: z.string().min(1).optional(),
  price: z.string().optional(),
  description: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock: z.number().int().optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export const GET = withAuth(async (_req, ctx, session) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;
  const orgId = session.session.activeOrganizationId;

  if (!orgId) {
    return err(400, 'No active organization selected');
  }

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.organizationId, orgId)))
    .limit(1);

  if (!product) {
    return err(404, 'Product not found');
  }

  return ok(product);
});

export const PATCH = withAuth(async (req, ctx, session) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;
  const orgId = session.session.activeOrganizationId;

  if (!orgId) {
    return err(400, 'No active organization selected');
  }

  const body = await req.json().catch(() => null);
  const parsed = UpdateProductBodySchema.safeParse(body);

  if (!parsed.success) {
    return err(422, parsed.error.errors[0]?.message ?? 'Validation error');
  }

  const updates: Partial<typeof products.$inferInsert> = {
    ...parsed.data,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(products)
    .set(updates)
    .where(and(eq(products.id, id), eq(products.organizationId, orgId)))
    .returning();

  if (!updated) {
    return err(404, 'Product not found');
  }

  return ok(updated);
});

export const DELETE = withAuth(async (_req, ctx, session) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;
  const orgId = session.session.activeOrganizationId;

  if (!orgId) {
    return err(400, 'No active organization selected');
  }

  const [deleted] = await db
    .delete(products)
    .where(and(eq(products.id, id), eq(products.organizationId, orgId)))
    .returning({ id: products.id });

  if (!deleted) {
    return err(404, 'Product not found');
  }

  return ok({ id: deleted.id });
});
