import { headers } from 'next/headers';
import { auth } from '@/features/auth/lib/auth';
import { withAuth } from '@/lib/api/middleware';
import { ok } from '@/lib/api/response';

export const GET = withAuth(async (_req, ctx, _session) => {
  const { orgId } = await ctx.params;

  const org = await auth.api.getFullOrganization({
    query: { organizationId: orgId },
    headers: await headers(),
  });

  return ok(org);
});

export const DELETE = withAuth(async (_req, ctx, _session) => {
  const { orgId } = await ctx.params;

  await auth.api.deleteOrganization({
    body: { organizationId: orgId },
    headers: await headers(),
  });

  return ok({ deleted: true });
});
