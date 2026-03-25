import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/features/auth/lib/auth';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { OrgCard } from '@/features/organizations/components/org-card';

export default async function OrganizationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const orgs = await auth.api.listOrganizations({ headers: await headers() });

  return (
    <>
      <PageHeader title="Organizations" description="Manage your organizations">
        <Button size="sm" render={<Link href="/organizations/new" />}>
          New organization
        </Button>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        {orgs && orgs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map((org) => (
              <OrgCard
                key={org.id}
                org={{
                  id: org.id,
                  name: org.name,
                  slug: org.slug,
                  createdAt: org.createdAt,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-muted-foreground text-sm tracking-wide">
              You don&apos;t belong to any organizations yet.
            </p>
            <Button size="sm" render={<Link href="/organizations/new" />}>
              Create your first organization
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
