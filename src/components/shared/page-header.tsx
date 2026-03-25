import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex flex-1 items-baseline gap-3">
        <h1 className="font-heading text-xl font-light tracking-wide">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground hidden text-sm tracking-wide sm:block">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
