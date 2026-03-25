import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/features/auth/lib/auth';
import { PageHeader } from '@/components/shared/page-header';
import { ProfileForm } from '@/features/profile/components/profile-form';

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const { user } = session;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal information"
      />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <div className="max-w-xl">
          <ProfileForm
            initialName={user.name}
            email={user.email}
            initialImage={user.image}
          />
        </div>
      </div>
    </>
  );
}
