import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { member } from '@/lib/db/schema';
import { type Role } from '@/types/roles';
import { auth } from '@/features/auth/lib/auth';
import { authRule, type ApiRouteContext } from './auth-rule';

export type RouteContext = ApiRouteContext;
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
    const gate = await authRule.requireSession(req);
    if (!gate.ok) return gate.response;
    return handler(req, ctx, gate.session);
  };
}

export function withRole(allowedRoles: Role[], handler: RoleHandler) {
  return withAuth(async (req, ctx, session) => {
    const gate = await authRule.requireOrgRoles(
      req,
      ctx,
      session,
      allowedRoles,
    );
    if (!gate.ok) return gate.response;
    return handler(req, ctx, session, gate.memberRecord);
  });
}

/** Any org member (member, admin, owner) */
export function withUser(handler: RoleHandler) {
  return withRole(['owner', 'admin', 'member'], handler);
}

/** Admin or owner only */
export function withAdmin(handler: RoleHandler) {
  return withRole(['owner', 'admin'], handler);
}

/** Owner only */
export function withOwner(handler: RoleHandler) {
  return withRole(['owner'], handler);
}
