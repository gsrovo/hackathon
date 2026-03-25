import { z } from 'zod';
import { registry } from '../registry';
import { commonResponses } from './common.schemas';

export const UserProfileSchema = registry.register(
  'UserProfile',
  z
    .object({
      id: z.string().openapi({ example: 'usr_01j9z' }),
      name: z.string().openapi({ example: 'Jane Doe' }),
      email: z.string().email().openapi({ example: 'jane@example.com' }),
      image: z.string().url().nullable().openapi({ example: null }),
      emailVerified: z.boolean().openapi({ example: true }),
    })
    .openapi('UserProfile'),
);

export const UpdateProfileSchema = registry.register(
  'UpdateProfile',
  z
    .object({
      name: z.string().min(1).optional().openapi({ example: 'Jane Doe' }),
      image: z.string().url().nullable().optional().openapi({ example: null }),
    })
    .openapi('UpdateProfile'),
);

registry.registerPath({
  method: 'get',
  path: '/api/v1/profile',
  tags: ['Profile'],
  summary: 'Get current user profile',
  responses: {
    200: {
      description: 'Current user profile',
      content: { 'application/json': { schema: UserProfileSchema } },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/profile',
  tags: ['Profile'],
  summary: 'Update current user profile',
  request: {
    body: {
      content: { 'application/json': { schema: UpdateProfileSchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated user profile',
      content: { 'application/json': { schema: UserProfileSchema } },
    },
    ...commonResponses,
  },
});
