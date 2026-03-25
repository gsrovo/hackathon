'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

interface AcceptInvitationFlowProps {
  invitationId: string;
}

export function AcceptInvitationFlow({
  invitationId,
}: AcceptInvitationFlowProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      const path = `/accept-invitation/${invitationId}`;
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(path)}`);
    }
  }, [isPending, session, invitationId, router]);

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/invitations/${invitationId}/accept`, {
        method: 'POST',
      });
      const json: {
        data?: {
          invitation?: { organizationId?: string };
          member?: { organizationId?: string };
        };
        message?: string;
      } = await res.json();

      if (!res.ok) {
        setError(json.message ?? 'Could not accept invitation');
        return;
      }

      const orgId =
        json.data?.invitation?.organizationId ??
        json.data?.member?.organizationId;

      if (orgId) {
        router.replace(`/organizations/${orgId}`);
        return;
      }
      router.replace('/dashboard');
    } finally {
      setBusy(false);
    }
  }

  if (isPending || !session) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-xl font-light tracking-wide">
            Organization invite
          </CardTitle>
          <CardDescription className="tracking-wide">
            Checking your session…
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-heading text-xl font-light tracking-wide">
          Join organization
        </CardTitle>
        <CardDescription className="tracking-wide">
          You are signed in as{' '}
          <span className="text-foreground font-medium">
            {session.user.email}
          </span>
          . Use the same email the invitation was created for.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
        <Button
          type="button"
          className="w-full"
          disabled={busy}
          onClick={() => void accept()}
        >
          {busy ? 'Joining…' : 'Accept invitation'}
        </Button>
      </CardContent>
    </Card>
  );
}
