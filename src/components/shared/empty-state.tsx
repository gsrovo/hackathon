import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <Inbox className="text-muted-foreground size-7" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-base font-medium tracking-wide">
          {title}
        </p>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm tracking-wide">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
