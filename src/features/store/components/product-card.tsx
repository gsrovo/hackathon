import { Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddToOrderButton } from './add-to-order-button';

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  sku: string | null;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  stock,
  sku,
}: ProductCardProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(price));

  return (
    <Card className="flex flex-col">
      {/* Product image placeholder */}
      <div className="bg-muted/30 flex h-40 items-center justify-center border-b">
        <Package className="text-muted-foreground/30 size-12" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-heading text-base leading-snug font-light tracking-wide">
            {name}
          </CardTitle>
          <span className="text-primary font-mono text-sm font-medium tabular-nums">
            {formatted}
          </span>
        </div>
        {sku && (
          <p className="text-muted-foreground font-mono text-xs">{sku}</p>
        )}
      </CardHeader>

      {description && (
        <CardContent className="pt-0 pb-3">
          <p className="text-muted-foreground line-clamp-2 text-sm tracking-wide">
            {description}
          </p>
        </CardContent>
      )}

      <CardFooter className="mt-auto flex items-center justify-between gap-2 pt-0">
        <Badge
          variant={stock > 0 ? 'outline' : 'secondary'}
          className={
            stock > 0
              ? 'border-emerald-500/40 text-xs text-emerald-600'
              : 'text-xs'
          }
        >
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </Badge>
        <AddToOrderButton productId={id} disabled={stock === 0} />
      </CardFooter>
    </Card>
  );
}
