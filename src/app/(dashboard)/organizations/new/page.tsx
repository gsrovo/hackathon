import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/features/auth/lib/auth';
import { PageHeader } from '@/components/shared/page-header';
import { CreateOrgForm } from '@/features/organizations/components/create-org-form';

export default async function NewOrganizationPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  return (
    <>
      <PageHeader
        title="New Organization"
        description="Create a new organization to collaborate with your team"
      />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <div className="max-w-xl">
          <CreateOrgForm />
        </div>
      </div>
    </>
  );
}
