import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { member } from '@/lib/db/schema';
import { type Role, hasAnyRole } from '@/types/roles';
import { err } from './response';
import { and, eq } from 'drizzle-orm';

type RouteContext = { params: Promise<Record<string, string>> };
type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;

type AuthedHandler = (
  req: NextRequest,
  ctx: RouteContext,
  session: NonNullable<SessionData>,
) => Promise<NextResponse>;

type RoleHandler = (
  req: NextRequest,
  ctx: RouteContext,
  session: NonNullable<SessionData>,
  memberRecord: typeof member.$inferSelect,
) => Promise<NextResponse>;

export function withAuth(handler: AuthedHandler) {
  return async (req: NextRequest, ctx: RouteContext): Promise<NextResponse> => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return err(401, 'Unauthorized');
    return handler(req, ctx, session);
  };
}

export function withRole(allowedRoles: Role[], handler: RoleHandler) {
  return withAuth(async (req, ctx, session) => {
    const params = await ctx.params;
    const orgId = params?.orgId ?? req.headers.get('x-org-id') ?? null;

    if (!orgId) return err(400, 'Organization ID is required');

    const memberRecord = await db.query.member.findFirst({
      where: and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, orgId),
      ),
    });

    if (!memberRecord)
      return err(403, 'Forbidden: not a member of this organization');
    if (!hasAnyRole(memberRecord.role, allowedRoles)) {
      return err(
        403,
        `Forbidden: requires one of [${allowedRoles.join(', ')}]`,
      );
    }

    return handler(req, ctx, session, memberRecord);
  });
}
