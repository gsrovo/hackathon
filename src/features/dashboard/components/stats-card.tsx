import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-normal tracking-widest uppercase">
          {title}
        </CardTitle>
        {Icon && <Icon className="text-primary/70 size-4 shrink-0" />}
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-heading text-primary text-4xl font-light tracking-tight">
          {value}
        </p>
        {description && (
          <p className="text-muted-foreground text-xs tracking-wide">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
