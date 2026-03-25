import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/lib/db/schema';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
    label: string;
  }
> = {
  pending: {
    variant: 'outline',
    label: 'Pending',
  },
  processing: {
    variant: 'secondary',
    label: 'Processing',
  },
  shipped: {
    variant: 'outline',
    className: 'border-amber-400 text-amber-600',
    label: 'Shipped',
  },
  delivered: {
    variant: 'outline',
    className: 'border-emerald-500 text-emerald-600 bg-emerald-50',
    label: 'Delivered',
  },
  cancelled: {
    variant: 'destructive',
    label: 'Cancelled',
  },
  refunded: {
    variant: 'outline',
    label: 'Refunded',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
