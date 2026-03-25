import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { withAuth } from '@/lib/api/middleware';
import { ok, err } from '@/lib/api/response';
import { zodFirstIssueMessage } from '@/lib/zod-error-message';

const UpdateProfileSchema = z
  .object({
    name: z.string().min(1).optional(),
    image: z.string().url().nullable().optional(),
  })
  .refine((d) => d.name !== undefined || d.image !== undefined, {
    message: 'At least one field must be provided',
  });

export const GET = withAuth(async (_req, _ctx, session) => {
  return ok({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    emailVerified: session.user.emailVerified,
  });
});

export const PATCH = withAuth(async (req, _ctx, session) => {
  const body = await req.json().catch(() => null);
  const parsed = UpdateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return err(422, zodFirstIssueMessage(parsed.error));
  }

  const updates: Partial<typeof user.$inferInsert> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.image !== undefined) updates.image = parsed.data.image;
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(user)
    .set(updates)
    .where(eq(user.id, session.user.id))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
    });

  return ok(updated);
});
