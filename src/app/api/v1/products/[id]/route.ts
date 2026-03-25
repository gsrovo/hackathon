import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { withUser, withAdmin } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';
import { zodFirstIssueMessage } from '@/lib/zod-error-message';

const UpdateProductBodySchema = z.object({
  name: z.string().min(1).optional(),
  price: z.string().optional(),
  description: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock: z.number().int().optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export const GET = withUser(async (_req, ctx, _session, memberRecord) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const [product] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, id),
        eq(products.organizationId, memberRecord.organizationId),
      ),
    )
    .limit(1);

  if (!product) return err(404, 'Product not found');

  return ok(product);
});

export const PATCH = withAdmin(async (req, ctx, _session, memberRecord) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const body = await req.json().catch(() => null);
  const parsed = UpdateProductBodySchema.safeParse(body);

  if (!parsed.success) {
    return err(422, zodFirstIssueMessage(parsed.error));
  }

  const [updated] = await db
    .update(products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(
      and(
        eq(products.id, id),
        eq(products.organizationId, memberRecord.organizationId),
      ),
    )
    .returning();

  if (!updated) return err(404, 'Product not found');

  return ok(updated);
});

export const DELETE = withAdmin(async (_req, ctx, _session, memberRecord) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const [deleted] = await db
    .delete(products)
    .where(
      and(
        eq(products.id, id),
        eq(products.organizationId, memberRecord.organizationId),
      ),
    )
    .returning({ id: products.id });

  if (!deleted) return err(404, 'Product not found');

  return ok({ id: deleted.id });
});
