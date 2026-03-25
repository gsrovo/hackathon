import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { member, user } from '@/lib/db/schema';
import { withUser, withAdmin } from '@/lib/api/middleware';
import { ok, created, err } from '@/lib/api/response';

const InviteMemberBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

export const GET = withUser(async (_req, ctx, _session, _member) => {
  const { orgId } = await ctx.params;

  const members = await db
    .select({
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(eq(member.organizationId, orgId));

  return ok(members);
});

export const POST = withAdmin(async (req, ctx, _session, _member) => {
  const { orgId } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = InviteMemberBodySchema.safeParse(body);

  if (!parsed.success) {
    return err(422, parsed.error.errors[0]?.message ?? 'Validation error');
  }

  const invitation = await auth.api.createInvitation({
    body: {
      email: parsed.data.email,
      role: parsed.data.role,
      organizationId: orgId,
    },
    headers: await headers(),
  });

  return created(invitation);
});
