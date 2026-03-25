import { z } from 'zod';
import { registry } from '../registry';
import { commonResponses } from './common.schemas';

export const OrganizationSchema = registry.register(
  'Organization',
  z
    .object({
      id: z.string().openapi({ example: 'org_01j9z' }),
      name: z.string().openapi({ example: 'Acme Corp' }),
      slug: z.string().nullable().openapi({ example: 'acme-corp' }),
      logo: z.string().url().nullable().openapi({ example: null }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: '2024-01-15T10:30:00.000Z' }),
    })
    .openapi('Organization'),
);

export const MemberSchema = registry.register(
  'Member',
  z
    .object({
      id: z.string().openapi({ example: 'mem_01j9z' }),
      organizationId: z.string().openapi({ example: 'org_01j9z' }),
      userId: z.string().openapi({ example: 'usr_01j9z' }),
      role: z.string().openapi({ example: 'member' }),
      createdAt: z
        .string()
        .datetime()
        .openapi({ example: '2024-01-15T10:30:00.000Z' }),
      user: z
        .object({
          name: z.string().openapi({ example: 'Jane Doe' }),
          email: z.string().email().openapi({ example: 'jane@example.com' }),
          image: z.string().url().nullable().openapi({ example: null }),
        })
        .openapi({ description: 'User details' }),
    })
    .openapi('Member'),
);

export const CreateOrganizationSchema = registry.register(
  'CreateOrganization',
  z
    .object({
      name: z.string().min(2).openapi({ example: 'Acme Corp' }),
      slug: z.string().optional().openapi({ example: 'acme-corp' }),
    })
    .openapi('CreateOrganization'),
);

export const InviteMemberSchema = registry.register(
  'InviteMember',
  z
    .object({
      email: z.string().email().openapi({ example: 'jane@example.com' }),
      role: z
        .enum(['owner', 'admin', 'member', 'viewer'])
        .openapi({ example: 'member' }),
    })
    .openapi('InviteMember'),
);

// ─── Paths ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/v1/organizations',
  tags: ['Organizations'],
  summary: "List current user's organizations",
  responses: {
    200: {
      description: 'List of organizations',
      content: {
        'application/json': { schema: z.array(OrganizationSchema) },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/organizations',
  tags: ['Organizations'],
  summary: 'Create a new organization',
  request: {
    body: {
      content: { 'application/json': { schema: CreateOrganizationSchema } },
    },
  },
  responses: {
    201: {
      description: 'Organization created',
      content: { 'application/json': { schema: OrganizationSchema } },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/organizations/{orgId}',
  tags: ['Organizations'],
  summary: 'Get organization detail',
  request: {
    params: z.object({ orgId: z.string() }),
  },
  responses: {
    200: {
      description: 'Organization detail with members',
      content: { 'application/json': { schema: OrganizationSchema } },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/organizations/{orgId}',
  tags: ['Organizations'],
  summary: 'Delete an organization (owner only)',
  request: {
    params: z.object({ orgId: z.string() }),
  },
  responses: {
    200: {
      description: 'Organization deleted',
      content: {
        'application/json': {
          schema: z.object({ deleted: z.boolean() }),
        },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/organizations/{orgId}/members',
  tags: ['Organizations'],
  summary: 'List organization members',
  request: {
    params: z.object({ orgId: z.string() }),
  },
  responses: {
    200: {
      description: 'List of members',
      content: {
        'application/json': { schema: z.array(MemberSchema) },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/organizations/{orgId}/members',
  tags: ['Organizations'],
  summary: 'Invite a member to the organization',
  request: {
    params: z.object({ orgId: z.string() }),
    body: {
      content: { 'application/json': { schema: InviteMemberSchema } },
    },
  },
  responses: {
    201: {
      description: 'Invitation sent',
      content: { 'application/json': { schema: z.object({ id: z.string() }) } },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/organizations/{orgId}/members/{userId}',
  tags: ['Organizations'],
  summary: 'Remove a member from the organization',
  request: {
    params: z.object({ orgId: z.string(), userId: z.string() }),
  },
  responses: {
    200: {
      description: 'Member removed',
      content: {
        'application/json': {
          schema: z.object({ removed: z.boolean() }),
        },
      },
    },
    ...commonResponses,
  },
});
