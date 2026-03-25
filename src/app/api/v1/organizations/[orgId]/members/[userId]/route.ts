import { headers } from 'next/headers';
import { auth } from '@/features/auth/lib/auth';
import { withAuth } from '@/lib/api/middleware';
import { ok } from '@/lib/api/response';

export const DELETE = withAuth(async (_req, ctx, _session) => {
  const { orgId, userId } = await ctx.params;

  await auth.api.removeMember({
    body: { userId, organizationId: orgId },
    headers: await headers(),
  });

  return ok({ removed: true });
});
