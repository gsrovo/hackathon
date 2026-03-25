import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge';
import { ArrowLeft } from 'lucide-react';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(num);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const { id } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, session.user.id)))
    .limit(1);

  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return (
    <>
      <PageHeader title="Order Detail">
        <Button variant="outline" size="sm" render={<Link href="/orders" />}>
          <ArrowLeft className="size-4" />
          Back to Orders
        </Button>
      </PageHeader>

      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        {/* Order summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-base font-medium tracking-wide">
              Order{' '}
              <span className="font-mono text-sm">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </CardTitle>
            <OrderStatusBadge status={order.status} />
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                Total
              </span>
              <span className="font-medium tabular-nums">
                {formatCurrency(order.totalAmount, order.currency)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                Currency
              </span>
              <span className="font-medium">{order.currency}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                Placed
              </span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order items */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium tracking-wide">
              Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <p className="text-muted-foreground px-6 pb-6 text-sm tracking-wide">
                No items in this order.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-y">
                    <th className="text-muted-foreground px-6 py-3 text-left font-medium tracking-wide">
                      Product ID
                    </th>
                    <th className="text-muted-foreground px-6 py-3 text-right font-medium tracking-wide">
                      Qty
                    </th>
                    <th className="text-muted-foreground px-6 py-3 text-right font-medium tracking-wide">
                      Unit Price
                    </th>
                    <th className="text-muted-foreground px-6 py-3 text-right font-medium tracking-wide">
                      Discount
                    </th>
                    <th className="text-muted-foreground px-6 py-3 text-right font-medium tracking-wide">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => {
                    const subtotal =
                      parseFloat(item.quantity) * parseFloat(item.unitPrice) -
                      parseFloat(item.discount);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="text-muted-foreground px-6 py-3 font-mono text-xs">
                          {item.productId.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-3 text-right tabular-nums">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-3 text-right tabular-nums">
                          {formatCurrency(item.unitPrice, order.currency)}
                        </td>
                        <td className="px-6 py-3 text-right tabular-nums">
                          {parseFloat(item.discount) > 0
                            ? `−${formatCurrency(item.discount, order.currency)}`
                            : '—'}
                        </td>
                        <td className="px-6 py-3 text-right font-medium tabular-nums">
                          {formatCurrency(subtotal.toFixed(2), order.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
