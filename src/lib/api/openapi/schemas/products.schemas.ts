import { z } from 'zod';
import { registry } from '../registry';
import { commonResponses, UuidSchema, TimestampSchema } from './common.schemas';

export const ProductStatusEnum = z.enum(['active', 'draft', 'archived']);

export const ProductSchema = registry.register(
  'Product',
  z
    .object({
      id: UuidSchema,
      organizationId: z.string().openapi({ example: 'org_01j9z' }),
      name: z.string().openapi({ example: 'Classic White Shirt' }),
      description: z
        .string()
        .nullable()
        .openapi({ example: 'A timeless classic.' }),
      sku: z.string().nullable().openapi({ example: 'SKU-001' }),
      price: z.string().openapi({ example: '89.99' }),
      stock: z.number().int().openapi({ example: 50 }),
      status: ProductStatusEnum.openapi({ example: 'active' }),
      imageUrl: z
        .string()
        .url()
        .nullable()
        .openapi({ example: 'https://example.com/image.jpg' }),
      createdAt: TimestampSchema,
    })
    .openapi('Product'),
);

export const CreateProductSchema = registry.register(
  'CreateProduct',
  z
    .object({
      name: z.string().min(1).openapi({ example: 'Classic White Shirt' }),
      price: z.string().openapi({ example: '89.99' }),
      description: z
        .string()
        .optional()
        .openapi({ example: 'A timeless classic.' }),
      sku: z.string().optional().openapi({ example: 'SKU-001' }),
      stock: z.number().int().optional().openapi({ example: 50 }),
    })
    .openapi('CreateProduct'),
);

export const UpdateProductSchema = registry.register(
  'UpdateProduct',
  z
    .object({
      name: z
        .string()
        .min(1)
        .optional()
        .openapi({ example: 'Classic White Shirt' }),
      price: z.string().optional().openapi({ example: '89.99' }),
      description: z
        .string()
        .nullable()
        .optional()
        .openapi({ example: 'A timeless classic.' }),
      sku: z.string().nullable().optional().openapi({ example: 'SKU-001' }),
      stock: z.number().int().optional().openapi({ example: 50 }),
      status: ProductStatusEnum.optional().openapi({ example: 'active' }),
      imageUrl: z
        .string()
        .url()
        .nullable()
        .optional()
        .openapi({ example: 'https://example.com/image.jpg' }),
    })
    .openapi('UpdateProduct'),
);

registry.registerPath({
  method: 'get',
  path: '/api/v1/products',
  tags: ['Products'],
  summary: 'List products for the active organization',
  responses: {
    200: {
      description: 'List of products',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(ProductSchema) }),
        },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/products',
  tags: ['Products'],
  summary: 'Create a new product',
  request: {
    body: {
      content: { 'application/json': { schema: CreateProductSchema } },
    },
  },
  responses: {
    201: {
      description: 'Product created',
      content: {
        'application/json': {
          schema: z.object({ data: ProductSchema }),
        },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/products/{id}',
  tags: ['Products'],
  summary: 'Get product by ID',
  request: {
    params: z.object({ id: UuidSchema }),
  },
  responses: {
    200: {
      description: 'Product detail',
      content: {
        'application/json': {
          schema: z.object({ data: ProductSchema }),
        },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/products/{id}',
  tags: ['Products'],
  summary: 'Update product',
  request: {
    params: z.object({ id: UuidSchema }),
    body: {
      content: { 'application/json': { schema: UpdateProductSchema } },
    },
  },
  responses: {
    200: {
      description: 'Product updated',
      content: {
        'application/json': {
          schema: z.object({ data: ProductSchema }),
        },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/products/{id}',
  tags: ['Products'],
  summary: 'Delete product',
  request: {
    params: z.object({ id: UuidSchema }),
  },
  responses: {
    200: {
      description: 'Product deleted',
      content: {
        'application/json': {
          schema: z.object({ data: z.object({ id: UuidSchema }) }),
        },
      },
    },
    ...commonResponses,
  },
});
