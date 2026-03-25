# Database

**Database:** PostgreSQL (Neon serverless)
**ORM:** Drizzle ORM
**Migrations:** drizzle-kit

## Schema Files

| File                            | Tables                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `src/lib/db/schema/auth.ts`     | `user`, `session`, `account`, `verification`, `organization`, `member`, `invitation` |
| `src/lib/db/schema/orders.ts`   | `orders`, `order_items`                                                              |
| `src/lib/db/schema/products.ts` | `products`                                                                           |
| `src/lib/db/schema/billing.ts`  | `billing_plans`, `organization_subscriptions`                                        |

## Table Definitions

### BetterAuth Tables

#### `user`

| Column         | Type      | Notes    |
| -------------- | --------- | -------- |
| id             | text      | PK       |
| name           | text      |          |
| email          | text      | unique   |
| email_verified | boolean   |          |
| image          | text      | nullable |
| created_at     | timestamp |          |
| updated_at     | timestamp |          |

#### `session`

| Column                 | Type      | Notes                                  |
| ---------------------- | --------- | -------------------------------------- |
| id                     | text      | PK                                     |
| expires_at             | timestamp |                                        |
| token                  | text      | unique                                 |
| user_id                | text      | FK → user                              |
| ip_address             | text      | nullable                               |
| user_agent             | text      | nullable                               |
| active_organization_id | text      | nullable — set by organizations plugin |

#### `organization`

| Column     | Type      | Notes                  |
| ---------- | --------- | ---------------------- |
| id         | text      | PK                     |
| name       | text      |                        |
| slug       | text      | unique, nullable       |
| logo       | text      | nullable               |
| metadata   | text      | nullable (JSON string) |
| created_at | timestamp |                        |

#### `member`

| Column          | Type      | Notes                              |
| --------------- | --------- | ---------------------------------- |
| id              | text      | PK                                 |
| organization_id | text      | FK → organization                  |
| user_id         | text      | FK → user                          |
| role            | text      | owner \| admin \| member \| viewer |
| created_at      | timestamp |                                    |

#### `invitation`

| Column          | Type      | Notes                            |
| --------------- | --------- | -------------------------------- |
| id              | text      | PK                               |
| organization_id | text      | FK → organization                |
| email           | text      |                                  |
| role            | text      | nullable                         |
| status          | text      | pending \| accepted \| cancelled |
| expires_at      | timestamp |                                  |
| inviter_id      | text      | FK → user                        |

### App Tables

#### `orders`

| Column          | Type          | Notes                                                                  |
| --------------- | ------------- | ---------------------------------------------------------------------- |
| id              | uuid          | PK, default gen_random_uuid()                                          |
| organization_id | text          | FK → organization                                                      |
| user_id         | text          | FK → user                                                              |
| status          | text          | pending \| processing \| shipped \| delivered \| cancelled \| refunded |
| total_amount    | numeric(10,2) |                                                                        |
| currency        | varchar(3)    | default 'USD'                                                          |
| metadata        | jsonb         | nullable                                                               |
| created_at      | timestamp     |                                                                        |
| updated_at      | timestamp     |                                                                        |

#### `order_items`

| Column     | Type          | Notes         |
| ---------- | ------------- | ------------- |
| id         | uuid          | PK            |
| order_id   | uuid          | FK → orders   |
| product_id | uuid          | FK → products |
| quantity   | integer       |               |
| unit_price | numeric(10,2) |               |
| discount   | numeric(10,2) | default 0     |

#### `products`

| Column          | Type          | Notes                       |
| --------------- | ------------- | --------------------------- |
| id              | uuid          | PK                          |
| organization_id | text          | FK → organization           |
| name            | varchar(255)  |                             |
| description     | text          | nullable                    |
| sku             | varchar(100)  | unique                      |
| price           | numeric(10,2) |                             |
| stock           | integer       | default 0                   |
| status          | text          | active \| draft \| archived |
| image_url       | text          | nullable                    |
| created_at      | timestamp     |                             |
| updated_at      | timestamp     |                             |

#### `billing_plans`

| Column        | Type          | Notes |
| ------------- | ------------- | ----- |
| id            | uuid          | PK    |
| name          | varchar(100)  |       |
| price_monthly | numeric(10,2) |       |
| price_yearly  | numeric(10,2) |       |
| features      | jsonb         |       |

#### `organization_subscriptions`

| Column               | Type      | Notes                                       |
| -------------------- | --------- | ------------------------------------------- |
| id                   | uuid      | PK                                          |
| organization_id      | text      | FK → organization                           |
| plan_id              | uuid      | FK → billing_plans                          |
| status               | text      | active \| trialing \| past_due \| cancelled |
| current_period_start | timestamp |                                             |
| current_period_end   | timestamp |                                             |
| stripe_customer_id   | text      | nullable                                    |
| stripe_sub_id        | text      | nullable                                    |

## Commands

```bash
# Generate migration files from schema changes
pnpm drizzle-kit generate

# Apply pending migrations
pnpm drizzle-kit migrate

# Open visual database browser
pnpm drizzle-kit studio

# Check migration status
pnpm drizzle-kit status
```

## Connection

Database URL stored in `.env.local` as `DATABASE_CONNECTION`.
The Drizzle client in `src/lib/db/index.ts` uses a `pg` connection pool.
The file is marked `server-only` — never imported by client components.
