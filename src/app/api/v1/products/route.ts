import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { withUser, withAdmin } from '@/lib/api/middleware';
import { ok, created, err } from '@/lib/api/response';

const CreateProductBodySchema = z.object({
  name: z.string().min(1),
  price: z.string(),
  description: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().optional(),
});

export const GET = withUser(async (_req, _ctx, _session, memberRecord) => {
  const productsList = await db
    .select()
    .from(products)
    .where(eq(products.organizationId, memberRecord.organizationId));

  return ok(productsList);
});

export const POST = withAdmin(async (req, _ctx, _session, memberRecord) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateProductBodySchema.safeParse(body);

  if (!parsed.success) {
    return err(422, parsed.error.errors[0]?.message ?? 'Validation error');
  }

  const { name, price, description, sku, stock } = parsed.data;

  const [product] = await db
    .insert(products)
    .values({
      organizationId: memberRecord.organizationId,
      name,
      price,
      description: description ?? null,
      sku: sku ?? null,
      stock: stock ?? 0,
    })
    .returning();

  return created(product);
});
