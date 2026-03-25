import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { PageHeader } from '@/components/shared/page-header';
import { ProductCard } from '@/features/store/components/product-card';
import { SeedProductsButton } from '@/features/store/components/seed-products-button';
import { Package } from 'lucide-react';

export default async function StorePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const orgId = session.session.activeOrganizationId;

  const catalog = orgId
    ? await db
        .select()
        .from(products)
        .where(eq(products.organizationId, orgId))
        .orderBy(products.name)
    : [];

  return (
    <>
      <PageHeader
        title="Store"
        description={
          orgId
            ? 'Browse products and add them to a new order.'
            : 'Select an organization to see its product catalog.'
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        {!orgId && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-20 text-center text-sm">
            <Package className="mb-2 size-10 opacity-30" />
            <p className="tracking-wide">No organization selected.</p>
            <p className="text-xs opacity-60">
              Use the switcher in the sidebar to activate one.
            </p>
          </div>
        )}

        {orgId && catalog.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Package className="text-muted-foreground/30 size-12" />
            <p className="text-muted-foreground text-sm tracking-wide">
              No products yet.
            </p>
            <p className="text-muted-foreground text-xs opacity-60">
              Seed some demo products to get started.
            </p>
            <SeedProductsButton />
          </div>
        )}

        {catalog.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catalog.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                price={p.price}
                stock={p.stock}
                sku={p.sku}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
