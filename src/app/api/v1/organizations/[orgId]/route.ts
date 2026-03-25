import { headers } from 'next/headers';
import { auth } from '@/features/auth/lib/auth';
import { withUser, withOwner } from '@/lib/api/middleware';
import { ok } from '@/lib/api/response';

export const GET = withUser(async (_req, ctx, _session, _member) => {
  const { orgId } = await ctx.params;

  const org = await auth.api.getFullOrganization({
    query: { organizationId: orgId },
    headers: await headers(),
  });

  return ok(org);
});

export const DELETE = withOwner(async (_req, ctx, _session, _member) => {
  const { orgId } = await ctx.params;

  await auth.api.deleteOrganization({
    body: { organizationId: orgId },
    headers: await headers(),
  });

  return ok({ deleted: true });
});
