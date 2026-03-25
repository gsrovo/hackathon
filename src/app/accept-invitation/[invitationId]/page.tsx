import { AcceptInvitationFlow } from '@/features/organizations/components/accept-invitation-flow';

interface PageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function AcceptInvitationPage({ params }: PageProps) {
  const { invitationId } = await params;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center p-6">
      <AcceptInvitationFlow invitationId={invitationId} />
    </div>
  );
}
