# Roadmap: Multi-Org E-Commerce Account Dashboard

## Overview

User account dashboard for a multi-organization e-commerce platform. Users can belong to multiple organizations, switch between them, manage members, orders, and settings.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind 4 · shadcn/ui · BetterAuth · PostgreSQL · Drizzle ORM · Swagger/OpenAPI

---

## Implementation Phases

### Phase 1 — Infrastructure ✅

> Foundation everything else depends on

- [x] Install core packages (`better-auth`, `drizzle-orm`, `pg`, `zod`, `react-hook-form`, etc.)
- [x] `src/lib/db/index.ts` — Drizzle client singleton (`server-only`)
- [x] `src/lib/db/schema/auth.ts` — BetterAuth-managed tables
- [x] `src/features/auth/lib/auth.ts` — BetterAuth server instance (organizations plugin + Google OAuth)
- [x] `src/app/api/auth/[...betterauth]/route.ts` — BetterAuth catch-all handler
- [x] `src/lib/auth-client.ts` — browser client with `organizationClient()` plugin
- [x] `drizzle.config.ts` + `.env.local`
- [x] `src/types/api.ts` + `src/types/roles.ts`
- [x] `src/lib/api/response.ts` + `src/lib/api/middleware.ts` (RBAC HOFs)

### Phase 2 — App Database Schemas ✅

> Orders and products tables (billing/subscriptions out of MVP scope)

- [x] `src/lib/db/schema/orders.ts` — `orders`, `order_items`
- [x] `src/lib/db/schema/products.ts` — `products`
- [x] Update `src/lib/db/schema/index.ts`
- [x] Run `pnpm db:generate && pnpm db:migrate`

### Phase 3 — OpenAPI / Swagger Setup ✅

> Single source of truth for API contracts

- [x] Install `@asteasolutions/zod-to-openapi`, `swagger-ui-react`
- [x] `src/lib/api/openapi/registry.ts` — central OpenAPI registry
- [x] `src/lib/api/openapi/spec.ts` — generates and caches the JSON spec
- [x] `src/lib/api/openapi/schemas/common.schemas.ts`
- [x] `src/app/api/docs/route.ts` — serves OpenAPI JSON
- [x] `src/app/api-docs/page.tsx` — Swagger UI ("use client")

### Phase 4 — Auth UI ✅

> Sign-in, sign-up, Google OAuth button

- [x] Add shadcn: `input`, `label`, `card`, `separator`
- [x] `src/features/auth/components/sign-in-form.tsx`
- [x] `src/features/auth/components/sign-up-form.tsx`
- [x] `src/features/auth/components/google-oauth-button.tsx`
- [x] `src/features/auth/hooks/use-session.ts`
- [x] `src/app/(auth)/sign-in/page.tsx` + `sign-up/page.tsx`
- [x] `src/app/(auth)/layout.tsx`

### Phase 5 — Dashboard Layout

> Session gate, sidebar, organization switcher

- [ ] Add shadcn: `sidebar`, `avatar`, `dropdown-menu`, `badge`, `sheet`
- [ ] `src/app/(dashboard)/layout.tsx` — RSC session gate (redirect to `/sign-in` if no session)
- [ ] `src/components/shared/org-switcher.tsx` ("use client")
- [ ] `src/components/shared/user-avatar.tsx`
- [ ] `src/components/shared/page-header.tsx`

### Phase 6 — Profile Feature

> View and edit user profile

- [ ] `src/lib/api/openapi/schemas/auth.schemas.ts`
- [ ] `src/app/api/v1/profile/route.ts` (`GET`, `PATCH` with `withAuth`)
- [ ] `src/features/profile/components/profile-form.tsx`
- [ ] `src/features/profile/components/avatar-upload.tsx`
- [ ] `src/app/(dashboard)/profile/page.tsx`

### Phase 7 — Organizations Feature

> Create, manage, invite members

- [ ] `src/lib/api/openapi/schemas/organizations.schemas.ts`
- [ ] Route handlers under `src/app/api/v1/organizations/`
  - `route.ts` (GET list, POST create)
  - `[orgId]/route.ts` (GET, PATCH, DELETE)
  - `[orgId]/members/route.ts` (GET, POST)
  - `[orgId]/members/[userId]/route.ts` (PATCH, DELETE)
  - `[orgId]/settings/route.ts` (GET, PATCH)
- [ ] `src/features/organizations/` — components, hooks, lib
- [ ] Pages under `src/app/(dashboard)/organizations/`

### Phase 8 — Orders Feature

> List and view orders

- [ ] `src/lib/api/openapi/schemas/orders.schemas.ts`
- [ ] Route handlers under `src/app/api/v1/orders/`
- [ ] `src/features/orders/` — components, hooks, lib
- [ ] `src/app/(dashboard)/orders/page.tsx` + `[id]/page.tsx`

### Phase 9 — Products

> Product catalog management (billing/subscriptions out of MVP scope)

- [ ] Route handlers for products (`GET`, `POST`, `PATCH`, `DELETE`)
- [ ] Dashboard widget for product list

### Phase 10 — Swagger UI (complete)

> All schemas registered, UI live

- [ ] Register all domain schemas in OpenAPI registry
- [ ] Validate spec at `/api/docs`
- [ ] Swagger UI live at `/api-docs`

### Phase 11 — Dashboard Home

> Stats, recent orders, activity feed

- [ ] `src/features/dashboard/components/stats-card.tsx`
- [ ] `src/features/dashboard/components/recent-orders-widget.tsx`
- [ ] `src/app/(dashboard)/dashboard/page.tsx` (RSC)
- [ ] `src/components/shared/data-table.tsx`
- [ ] `src/components/shared/empty-state.tsx`

### Phase 12 — Settings

> Account, organization, danger zone

- [ ] Account settings (email, password, session management)
- [ ] Organization settings (name, logo, slug)
- [ ] Danger zone (delete account, leave/delete org)

---

## Architecture Decisions

| Decision                              | Rationale                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| No `middleware.ts`                    | Avoids Edge Runtime constraints with Drizzle; protection done in RSC layouts + API HOFs |
| RSC fetches data via Drizzle directly | Avoids double serialization; API routes are the external contract                       |
| `server-only` on db/auth files        | Prevents accidental bundling of secrets into client                                     |
| Zod schemas as single source of truth | Reused for OpenAPI spec, request validation, and react-hook-form resolvers              |
| Active org via BetterAuth session     | `session.activeOrganizationId` managed by `organizations` plugin                        |

---

## API Endpoints Reference

| Method        | Path                                           | Min Role      |
| ------------- | ---------------------------------------------- | ------------- |
| GET, PATCH    | `/api/v1/profile`                              | authenticated |
| GET           | `/api/v1/orders`                               | authenticated |
| GET           | `/api/v1/orders/:id`                           | authenticated |
| POST          | `/api/v1/orders`                               | member        |
| PATCH, DELETE | `/api/v1/orders/:id`                           | admin         |
| GET, POST     | `/api/v1/organizations`                        | authenticated |
| GET           | `/api/v1/organizations/:orgId`                 | member        |
| PATCH         | `/api/v1/organizations/:orgId`                 | admin         |
| DELETE        | `/api/v1/organizations/:orgId`                 | owner         |
| GET           | `/api/v1/organizations/:orgId/members`         | member        |
| POST          | `/api/v1/organizations/:orgId/members`         | admin         |
| PATCH, DELETE | `/api/v1/organizations/:orgId/members/:userId` | admin         |
| GET, PATCH    | `/api/v1/organizations/:orgId/settings`        | admin         |
| GET           | `/api/v1/products`                             | member        |
| POST          | `/api/v1/products`                             | admin         |
| PATCH, DELETE | `/api/v1/products/:id`                         | admin / owner |
| GET           | `/api/docs`                                    | public        |

---

## Environment Variables

```env
DATABASE_CONNECTION=postgresql://...
BETTER_AUTH_SECRET=<32-char random string>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Commands

```bash
pnpm dev                          # start dev server
pnpm build                        # production build
pnpm lint                         # ESLint
pnpm drizzle-kit generate         # generate migrations
pnpm drizzle-kit migrate          # apply migrations
pnpm drizzle-kit studio           # visual DB browser
```
