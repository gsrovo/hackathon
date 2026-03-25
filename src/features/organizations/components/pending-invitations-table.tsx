'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAbsoluteAcceptInvitationUrl } from '@/lib/invitation-url';

export interface PendingInvitationRow {
  id: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: string | Date;
}

interface PendingInvitationsTableProps {
  orgId: string;
  initialInvitations: PendingInvitationRow[];
}

export function PendingInvitationsTable({
  orgId,
  initialInvitations,
}: PendingInvitationsTableProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialInvitations);
  const [canceling, setCanceling] = useState<string | null>(null);
  const [copyFlash, setCopyFlash] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialInvitations);
  }, [initialInvitations]);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/v1/organizations/${orgId}/invitations`);
    if (!res.ok) return;
    const json: { data?: PendingInvitationRow[] } = await res.json();
    if (Array.isArray(json.data)) {
      setRows(json.data);
    }
  }, [orgId]);

  async function copyLink(invitationId: string) {
    const url = getAbsoluteAcceptInvitationUrl(invitationId);
    try {
      await navigator.clipboard.writeText(url);
      setCopyFlash(invitationId);
      setTimeout(() => setCopyFlash(null), 2000);
    } catch {
      /* ignore */
    }
  }

  async function cancel(invitationId: string) {
    setCanceling(invitationId);
    try {
      await fetch(
        `/api/v1/organizations/${orgId}/invitations/${invitationId}`,
        { method: 'DELETE' },
      );
      await refresh();
      router.refresh();
    } finally {
      setCanceling(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No pending invitations.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {rows.map((inv, index) => (
        <div key={inv.id}>
          {index > 0 && <Separator />}
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{inv.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {inv.role && (
                  <Badge variant="outline" className="capitalize">
                    {inv.role}
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs">
                  Expires{' '}
                  {new Date(inv.expiresAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void copyLink(inv.id)}
              >
                {copyFlash === inv.id ? 'Copied' : 'Copy link'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={canceling === inv.id}
                onClick={() => void cancel(inv.id)}
              >
                {canceling === inv.id ? 'Canceling…' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
