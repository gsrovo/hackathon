'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './order-status-badge';
import type { OrderStatus } from '@/lib/db/schema';

interface OrderRow {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  currency: string;
  createdAt: Date;
}

interface OrdersTableProps {
  orders: OrderRow[];
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
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-2 py-16 text-sm tracking-wide">
        <p>No orders found.</p>
        <p className="text-xs opacity-60">
          Orders will appear here once they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            <th className="text-muted-foreground px-4 py-3 text-left font-medium tracking-wide">
              Date
            </th>
            <th className="text-muted-foreground px-4 py-3 text-left font-medium tracking-wide">
              Order ID
            </th>
            <th className="text-muted-foreground px-4 py-3 text-left font-medium tracking-wide">
              Status
            </th>
            <th className="text-muted-foreground px-4 py-3 text-right font-medium tracking-wide">
              Amount
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-muted/20 transition-colors">
              <td className="text-muted-foreground px-4 py-3 tabular-nums">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3 font-mono text-xs">
                {order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums">
                {formatCurrency(order.totalAmount, order.currency)}
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  variant="outline"
                  render={<Link href={`/orders/${order.id}`} />}
                  className="h-7 px-3 text-xs"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
