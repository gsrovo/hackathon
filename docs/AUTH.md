# Authentication

**Library:** BetterAuth v1.x
**Plugins:** `organizations`
**Providers:** Email/password + Google OAuth

## Server Instance

`src/features/auth/lib/auth.ts` — server-only. Never import this in client components.

```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: { google: { ... } },
  plugins: [organization({ allowUserToCreateOrganization: true })],
  emailAndPassword: { enabled: true },
})
```

## Browser Client

`src/lib/auth-client.ts` — used in client components and hooks.

```typescript
import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [organizationClient()],
});
```

## API Handler

`src/app/api/auth/[...betterauth]/route.ts` — catch-all that delegates to BetterAuth.

```typescript
import { toNextJsHandler } from 'better-auth/next-js';
export const { GET, POST } = toNextJsHandler(auth);
```

BetterAuth exposes endpoints like:

- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`
- `GET /api/auth/sign-in/google`
- `POST /api/auth/sign-out`
- `GET /api/auth/session`

## Session Reading

**Server Components / Route Handlers:**

```typescript
const session = await auth.api.getSession({ headers: req.headers });
// session.user — the authenticated user
// session.session.activeOrganizationId — current org context
```

**Client Components:**

```typescript
const { data: session } = authClient.useSession();
```

## Organizations Plugin

Provides multi-tenancy out of the box:

- Create organizations
- Invite members by email
- Assign roles: `owner`, `admin`, `member`, `viewer`
- Switch active organization

**Switch active org (client):**

```typescript
await authClient.organization.setActive({ organizationId: 'org_...' });
```

**Read active org (server):**

```typescript
const session = await auth.api.getSession({ headers });
const activeOrgId = session?.session.activeOrganizationId;
```

## Google OAuth Setup

1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API / People API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`

## Route Protection

Two independent layers:

**Layer 1 — RSC page protection** (`src/app/(dashboard)/layout.tsx`):

```typescript
const session = await auth.api.getSession({ headers: headers() });
if (!session) redirect('/sign-in');
```

**Layer 2 — API route protection** (`src/lib/api/middleware.ts`):

```typescript
export const GET = withAuth(async (req, ctx, session) => { ... })
export const POST = withRole("admin", async (req, ctx, session, member) => { ... })
```
