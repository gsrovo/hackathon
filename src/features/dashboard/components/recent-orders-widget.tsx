import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  currency: string;
  createdAt: Date;
}

interface RecentOrdersWidgetProps {
  orders: Order[];
}

function getStatusVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'delivered':
      return 'default';
    case 'shipped':
    case 'processing':
      return 'secondary';
    case 'cancelled':
    case 'refunded':
      return 'destructive';
    default:
      return 'outline';
  }
}

function formatAmount(amount: string, currency: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base font-semibold tracking-tight">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Your recent orders will appear here."
          />
        ) : (
          <ul className="flex flex-col divide-y">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground font-mono text-xs">
                    #{order.id.slice(0, 8)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
                <span className="font-mono text-sm font-medium tabular-nums">
                  {formatAmount(order.totalAmount, order.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/orders"
          className="text-primary text-xs tracking-wide hover:underline"
        >
          View all orders →
        </Link>
      </CardFooter>
    </Card>
  );
}
