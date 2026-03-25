import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/features/auth/lib/auth';
import { db } from '@/lib/db';
import { member } from '@/lib/db/schema';
import { type Role, hasAnyRole } from '@/types/roles';
import { err } from './response';

export type ApiRouteContext = { params: Promise<Record<string, string>> };

type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;
type AuthedSession = NonNullable<SessionData>;

export type SessionGate =
  | { ok: true; session: AuthedSession }
  | { ok: false; response: NextResponse };

export type OrgRoleGate =
  | { ok: true; memberRecord: typeof member.$inferSelect }
  | { ok: false; response: NextResponse };

/**
 * Central place for API access checks. Prefer these rules over ad-hoc
 * `getSession` + manual branches so every route documents intent clearly.
 */
export const authRule = {
  async requireSession(req: NextRequest): Promise<SessionGate> {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return { ok: false, response: err(401, 'Unauthorized') };
    }
    return { ok: true, session };
  },

  /**
   * Requires an organization id (from route `orgId`, `x-org-id`, or active org)
   * and membership with one of the allowed roles.
   */
  async requireOrgRoles(
    req: NextRequest,
    ctx: ApiRouteContext,
    session: AuthedSession,
    allowedRoles: Role[],
  ): Promise<OrgRoleGate> {
    const params = await ctx.params;
    const orgId =
      params?.orgId ??
      req.headers.get('x-org-id') ??
      session.session.activeOrganizationId ??
      null;

    if (!orgId) {
      return { ok: false, response: err(400, 'Organization ID is required') };
    }

    const memberRecord = await db.query.member.findFirst({
      where: and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, orgId),
      ),
    });

    if (!memberRecord) {
      return {
        ok: false,
        response: err(403, 'Forbidden: not a member of this organization'),
      };
    }

    if (!hasAnyRole(memberRecord.role, allowedRoles)) {
      return {
        ok: false,
        response: err(
          403,
          `Forbidden: requires one of [${allowedRoles.join(', ')}]`,
        ),
      };
    }

    return { ok: true, memberRecord };
  },
};
