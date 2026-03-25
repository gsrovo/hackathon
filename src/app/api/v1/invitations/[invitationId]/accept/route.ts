import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/features/auth/lib/auth';
import { authRule } from '@/lib/api/auth-rule';
import type { ApiRouteContext } from '@/lib/api/auth-rule';
import { ok, err } from '@/lib/api/response';

export async function POST(
  req: NextRequest,
  ctx: ApiRouteContext,
): Promise<NextResponse> {
  const gate = await authRule.requireSession(req);
  if (!gate.ok) return gate.response;

  const { invitationId } = await ctx.params;

  try {
    const result = await auth.api.acceptInvitation({
      body: { invitationId },
      headers: req.headers,
    });

    return ok(result);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Failed to accept invitation';
    return err(400, message);
  }
}
