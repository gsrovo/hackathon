'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/shared/user-avatar';

interface MemberUser {
  name: string;
  email: string;
  image?: string | null;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  createdAt: string | Date;
  user: MemberUser;
}

interface MembersTableProps {
  members: Member[];
  orgId: string;
  canManage: boolean;
}

const ROLE_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
  viewer: 'outline',
};

export function MembersTable({ members, orgId, canManage }: MembersTableProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleRemove(userId: string) {
    setRemoving(userId);
    try {
      await fetch(`/api/v1/organizations/${orgId}/members/${userId}`, {
        method: 'DELETE',
      });
      router.refresh();
    } finally {
      setRemoving(null);
    }
  }

  if (members.length === 0) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        No members yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {members.map((m, index) => (
        <div key={m.id}>
          {index > 0 && <Separator />}
          <div className="flex items-center gap-4 py-4">
            <UserAvatar
              name={m.user.name}
              image={m.user.image}
              className="size-9"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">
                {m.user.name}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {m.user.email}
              </span>
            </div>
            <Badge
              variant={ROLE_VARIANT[m.role] ?? 'outline'}
              className="capitalize"
            >
              {m.role}
            </Badge>
            {canManage && m.role !== 'owner' && (
              <Button
                variant="ghost"
                size="sm"
                disabled={removing === m.userId}
                onClick={() => handleRemove(m.userId)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                {removing === m.userId ? 'Removing…' : 'Remove'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
