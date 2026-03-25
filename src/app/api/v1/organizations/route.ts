import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/features/auth/lib/auth';
import { withAuth } from '@/lib/api/middleware';
import { ok, created, err } from '@/lib/api/response';

const CreateOrganizationBodySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
});

export const GET = withAuth(async (_req, _ctx, _session) => {
  const orgs = await auth.api.listOrganizations({
    headers: await headers(),
  });
  return ok(orgs);
});

export const POST = withAuth(async (req, _ctx, _session) => {
  const body = await req.json().catch(() => null);
  const parsed = CreateOrganizationBodySchema.safeParse(body);

  if (!parsed.success) {
    return err(422, parsed.error.errors[0]?.message ?? 'Validation error');
  }

  const org = await auth.api.createOrganization({
    body: { name: parsed.data.name, slug: parsed.data.slug },
    headers: await headers(),
  });

  return created(org);
});
