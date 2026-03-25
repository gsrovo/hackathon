# Architecture

## Folder Structure

```
src/
├── app/                        # Routes ONLY — no business logic
│   ├── (auth)/                 # Unauthenticated pages (sign-in, sign-up)
│   ├── (dashboard)/            # Protected pages — session gate in layout.tsx
│   ├── api/
│   │   ├── auth/[...betterauth]/  # BetterAuth catch-all handler
│   │   ├── v1/                 # Versioned REST API
│   │   └── docs/               # OpenAPI JSON spec endpoint
│   └── api-docs/               # Swagger UI page
│
├── features/<name>/            # Self-contained feature modules
│   ├── components/             # Feature-specific UI components
│   ├── hooks/                  # Feature-specific React hooks
│   ├── lib/                    # Feature fetch clients / business logic
│   └── types/                  # Feature-specific types
│
├── components/
│   ├── ui/                     # shadcn/ui — NEVER edit manually
│   └── shared/                 # Reusable components, always built from ui/
│
├── lib/
│   ├── db/                     # Drizzle client + schema + migrations
│   ├── api/                    # API middleware (RBAC), response helpers, OpenAPI
│   ├── auth-client.ts          # BetterAuth browser client
│   └── utils.ts                # cn() utility
│
├── hooks/                      # Global React hooks
└── types/                      # Shared types (ApiResponse, Role, etc.)
```

## Authentication Flow

```
User visits /dashboard
  └── (dashboard)/layout.tsx (RSC)
        └── auth.api.getSession({ headers })
              ├── No session → redirect("/sign-in")
              └── Session → render page

User calls API /api/v1/*
  └── withAuth HOF
        └── auth.api.getSession({ headers: req.headers })
              ├── No session → 401 Unauthorized
              └── Session → handler(req, ctx, session)

Organization-scoped API
  └── withRole(["admin", "owner"], handler)
        └── withAuth → check member table
              ├── Not a member → 403 Forbidden
              ├── Role not in allowed list → 403 Forbidden
              └── OK → handler(req, ctx, session, member)
```

## Data Access Pattern

**Server Components (pages)** — use Drizzle directly:

```typescript
// app/(dashboard)/orders/page.tsx
import { db } from "@/lib/db"
const orders = await db.query.orders.findMany({ where: ... })
```

**Client Components** — call API routes via fetch wrappers in `features/<name>/lib/`:

```typescript
// features/orders/lib/orders-api.ts
export async function getOrders() {
  const res = await fetch('/api/v1/orders');
  return res.json();
}
```

The API routes exist as a **documented external contract** (Swagger). RSC pages avoid double serialization by reading the database directly.

## RBAC Role Hierarchy

```
owner  (4)  — full control, billing, delete org
admin  (3)  — manage members, update settings, manage products/orders
member (2)  — create orders, view org data
viewer (1)  — read-only access
```

The hierarchy numeric values are used by `hasRole(userRole, requiredRole)` for comparison-based checks.

For endpoint protection, use `withRole(allowedRoles, handler)` — an explicit allowlist:

```typescript
// src/lib/api/middleware.ts

// Only authenticated — no org scope required
export const GET = withAuth(async (req, ctx, session) => { ... })

// Explicit role allowlist — user's role must be in the array
export const POST  = withRole(["member", "admin", "owner"], handler)
export const PATCH = withRole(["admin", "owner"], handler)
export const DELETE = withRole(["owner"], handler)
```

`withRole` resolves the `orgId` from route params (`ctx.params.orgId`) or the `x-org-id` request header, then queries the `member` table to verify the user belongs to the organization and holds one of the allowed roles.

**Helper functions** (`src/types/roles.ts`):

| Function     | Signature                              | Use case                                     |
| ------------ | -------------------------------------- | -------------------------------------------- |
| `hasRole`    | `(userRole, requiredRole) → boolean`   | Hierarchy check: user level ≥ required level |
| `hasAnyRole` | `(userRole, allowedRoles[]) → boolean` | Exact membership check used by `withRole`    |

## OpenAPI / Swagger

1. **Zod schemas** in `lib/api/openapi/schemas/` — annotated with `.openapi()`
2. **Registry** in `lib/api/openapi/registry.ts` — all routes registered here
3. **Spec** in `lib/api/openapi/spec.ts` — generated once, cached as module singleton
4. **Served** at `GET /api/docs` as `application/json`
5. **UI** at `/api-docs` — `swagger-ui-react` ("use client" page)

The same Zod schemas are reused as `react-hook-form` resolvers in form components — single source of truth for validation.

## Database Schema Overview

### BetterAuth tables (managed by BetterAuth adapter)

- `user`, `session`, `account`, `verification`
- `organization`, `member`, `invitation` (organizations plugin)

### App tables

- `orders`, `order_items`
- `products`
- `billing_plans`, `organization_subscriptions`

All tables defined in `src/lib/db/schema/` so `drizzle-kit` can manage migrations.

## Key Packages

| Package                          | Purpose                                            |
| -------------------------------- | -------------------------------------------------- |
| `better-auth`                    | Authentication engine + organizations plugin       |
| `drizzle-orm`                    | Type-safe ORM                                      |
| `drizzle-kit`                    | Migrations CLI                                     |
| `pg`                             | PostgreSQL driver                                  |
| `zod`                            | Schema validation + OpenAPI source                 |
| `@asteasolutions/zod-to-openapi` | Zod → OpenAPI 3.1 spec                             |
| `swagger-ui-react`               | Swagger UI component                               |
| `react-hook-form`                | Form state management                              |
| `server-only`                    | Prevents server code from leaking to client bundle |
