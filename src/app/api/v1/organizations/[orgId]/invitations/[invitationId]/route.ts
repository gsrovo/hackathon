import { headers } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { invitation } from '@/lib/db/schema';
import { withAdmin } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';

export const DELETE = withAdmin(async (_req, ctx, _session, _member) => {
  const { orgId, invitationId } = await ctx.params;

  const row = await db
    .select({ id: invitation.id })
    .from(invitation)
    .where(
      and(
        eq(invitation.id, invitationId),
        eq(invitation.organizationId, orgId),
      ),
    )
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!row) {
    return err(404, 'Invitation not found');
  }

  try {
    await auth.api.cancelInvitation({
      body: { invitationId },
      headers: await headers(),
    });
    return ok({ canceled: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Failed to cancel invitation';
    return err(400, message);
  }
});
