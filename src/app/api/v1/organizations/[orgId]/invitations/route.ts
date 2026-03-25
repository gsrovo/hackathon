import { headers } from 'next/headers';
import { auth } from '@/features/auth/lib/auth';
import { withAdmin } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';

export const GET = withAdmin(async (_req, ctx, _session, _member) => {
  const { orgId } = await ctx.params;

  try {
    const invitations = await auth.api.listInvitations({
      query: { organizationId: orgId },
      headers: await headers(),
    });

    const list = Array.isArray(invitations) ? invitations : [];
    const pending = list.filter((inv) => inv.status === 'pending');

    return ok(pending);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Failed to list invitations';
    return err(400, message);
  }
});
