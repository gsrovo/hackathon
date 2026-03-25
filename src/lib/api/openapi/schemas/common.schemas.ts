import { z } from 'zod';
import { registry } from '../registry';

// ─── Reusable primitives ──────────────────────────────────────────────────────

export const UuidSchema = z
  .string()
  .uuid()
  .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' });

export const TimestampSchema = z
  .string()
  .datetime()
  .openapi({ example: '2024-01-15T10:30:00.000Z' });

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .openapi({ example: 20 }),
});

// ─── Generic response wrappers ────────────────────────────────────────────────

export const ApiErrorSchema = registry.register(
  'ApiError',
  z.object({
    error: z.string().openapi({ example: 'Forbidden' }),
    message: z
      .string()
      .openapi({ example: 'Forbidden: requires one of [admin, owner]' }),
    statusCode: z.number().int().openapi({ example: 403 }),
  }),
);

export const PaginationSchema = registry.register(
  'Pagination',
  z.object({
    page: z.number().int().openapi({ example: 1 }),
    pageSize: z.number().int().openapi({ example: 20 }),
    total: z.number().int().openapi({ example: 100 }),
    totalPages: z.number().int().openapi({ example: 5 }),
  }),
);

// ─── Shared response components ───────────────────────────────────────────────

export const commonResponses = {
  400: {
    description: 'Bad Request',
    content: { 'application/json': { schema: ApiErrorSchema } },
  },
  401: {
    description: 'Unauthorized — missing or invalid session',
    content: { 'application/json': { schema: ApiErrorSchema } },
  },
  403: {
    description: 'Forbidden — insufficient role',
    content: { 'application/json': { schema: ApiErrorSchema } },
  },
  404: {
    description: 'Not Found',
    content: { 'application/json': { schema: ApiErrorSchema } },
  },
  500: {
    description: 'Internal Server Error',
    content: { 'application/json': { schema: ApiErrorSchema } },
  },
} as const;
