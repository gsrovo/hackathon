'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORG_INVITE_ROLES } from '@/features/organizations/lib/invite-roles';
import { getAbsoluteAcceptInvitationUrl } from '@/lib/invitation-url';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(ORG_INVITE_ROLES),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteMemberFormProps {
  orgId: string;
}

export function InviteMemberForm({ orgId }: InviteMemberFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'member' },
  });

  async function onSubmit(values: InviteFormValues) {
    setServerError(null);
    setInviteUrl(null);
    setCopied(false);

    const res = await fetch(`/api/v1/organizations/${orgId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const json: { data?: { id: string }; message?: string } = await res
      .json()
      .catch(() => ({}));

    if (!res.ok) {
      setServerError(json.message ?? 'Failed to create invitation');
      return;
    }

    const id = json.data?.id;
    if (!id) {
      setServerError('Invitation created but no id returned');
      return;
    }

    setInviteUrl(getAbsoluteAcceptInvitationUrl(id));
    reset({ email: '', role: 'member' });
    router.refresh();
  }

  async function copyLink() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setServerError('Could not copy to clipboard');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invite-email">Invitee email</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="colleague@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invite-role">Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_INVITE_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-destructive text-sm">{errors.role.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-destructive text-sm" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create invite link'}
        </Button>
      </form>

      {inviteUrl && (
        <div className="bg-muted/50 flex flex-col gap-2 rounded-md border p-3">
          <p className="text-muted-foreground text-xs tracking-wide">
            Share this link with the invitee (same email as above). It is not
            sent by email.
          </p>
          <code className="text-foreground text-xs break-all">{inviteUrl}</code>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="self-start"
            onClick={() => void copyLink()}
          >
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div>
      )}
    </div>
  );
}
