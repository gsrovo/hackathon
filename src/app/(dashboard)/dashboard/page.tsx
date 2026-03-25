import { PageHeader } from '@/components/shared/page-header';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back" />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <p className="text-muted-foreground text-sm tracking-wide">
          Your dashboard is being built. Check back soon.
        </p>
      </div>
    </>
  );
}
