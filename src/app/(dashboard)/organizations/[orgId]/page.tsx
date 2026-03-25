import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/features/auth/lib/auth';
import { PageHeader } from '@/components/shared/page-header';
import { MembersTable } from '@/features/organizations/components/members-table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrgDetailPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function OrgDetailPage({ params }: OrgDetailPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const { orgId } = await params;

  const org = await auth.api.getFullOrganization({
    query: { organizationId: orgId },
    headers: await headers(),
  });

  if (!org) notFound();

  const members = org.members ?? [];

  const currentMember = members.find(
    (m: { userId: string; role: string }) => m.userId === session.user.id,
  );
  const canManage =
    currentMember?.role === 'owner' || currentMember?.role === 'admin';

  const createdDate =
    org.createdAt instanceof Date ? org.createdAt : new Date(org.createdAt);

  return (
    <>
      <PageHeader
        title={org.name}
        description={org.slug ? `/${org.slug}` : undefined}
      />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        {/* Org details */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-light tracking-wide">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-28 text-sm">Name</span>
              <span className="text-sm font-medium">{org.name}</span>
            </div>
            {org.slug && (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground w-28 text-sm">Slug</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {org.slug}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-28 text-sm">
                Created
              </span>
              <span className="text-sm">
                {createdDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-28 text-sm">
                Members
              </span>
              <span className="text-sm">{members.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-light tracking-wide">
              Members
            </CardTitle>
            <CardDescription className="tracking-wide">
              People with access to this organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembersTable
              members={members.map(
                (m: {
                  id: string;
                  userId: string;
                  role: string;
                  createdAt: string | Date;
                  user?: {
                    name?: string;
                    email?: string;
                    image?: string | null;
                  } | null;
                }) => ({
                  id: m.id,
                  userId: m.userId,
                  role: m.role,
                  createdAt: m.createdAt,
                  user: {
                    name: m.user?.name ?? 'Unknown',
                    email: m.user?.email ?? '',
                    image: m.user?.image ?? null,
                  },
                }),
              )}
              orgId={orgId}
              canManage={canManage}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
