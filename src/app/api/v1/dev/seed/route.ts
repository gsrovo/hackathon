import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { withAuth } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';

const SAMPLE_PRODUCTS = [
  {
    name: 'Obsidian Pen',
    description: 'Precision matte-black ballpoint. Aerospace aluminium barrel.',
    sku: 'PEN-OBD-001',
    price: '129.00',
    stock: 48,
    imageUrl: null,
  },
  {
    name: 'Ivory Notebook',
    description: 'Thread-bound A5 notebook. 200 gsm ivory pages.',
    sku: 'NB-IVR-001',
    price: '89.00',
    stock: 120,
    imageUrl: null,
  },
  {
    name: 'Slate Desk Mat',
    description: 'Full-grain leather desk mat. 60 × 30 cm. Stone grey.',
    sku: 'DM-SLT-001',
    price: '249.00',
    stock: 35,
    imageUrl: null,
  },
  {
    name: 'Brass Card Holder',
    description: 'Solid brass business card holder. Hand-brushed finish.',
    sku: 'CH-BRS-001',
    price: '179.00',
    stock: 60,
    imageUrl: null,
  },
  {
    name: 'Ceramic Mug',
    description: 'Double-walled porcelain mug. 350 ml. Matte white glaze.',
    sku: 'MG-CRM-001',
    price: '65.00',
    stock: 200,
    imageUrl: null,
  },
];

export const POST = withAuth(async (_req, _ctx, session) => {
  const orgId = session.session.activeOrganizationId;
  if (!orgId) {
    return err(400, 'No active organization. Select an organization first.');
  }

  const suffix = orgId.slice(0, 6).toUpperCase();

  const inserted = await db
    .insert(products)
    .values(
      SAMPLE_PRODUCTS.map((p) => ({
        ...p,
        sku: `${p.sku}-${suffix}`,
        organizationId: orgId,
        status: 'active' as const,
      })),
    )
    .onConflictDoNothing()
    .returning({ id: products.id, name: products.name });

  return ok({ seeded: inserted.length, products: inserted });
});
