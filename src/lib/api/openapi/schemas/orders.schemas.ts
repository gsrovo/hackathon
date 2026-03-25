import { z } from 'zod';
import { registry } from '../registry';
import { commonResponses, UuidSchema, TimestampSchema } from './common.schemas';

export const OrderStatusEnum = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

export const OrderItemSchema = registry.register(
  'OrderItem',
  z
    .object({
      id: UuidSchema,
      orderId: UuidSchema,
      productId: UuidSchema,
      quantity: z.string().openapi({ example: '2' }),
      unitPrice: z.string().openapi({ example: '49.99' }),
      discount: z.string().openapi({ example: '0.00' }),
    })
    .openapi('OrderItem'),
);

export const OrderSchema = registry.register(
  'Order',
  z
    .object({
      id: UuidSchema,
      organizationId: z.string().openapi({ example: 'org_01j9z' }),
      userId: z.string().openapi({ example: 'usr_01j9z' }),
      status: OrderStatusEnum.openapi({ example: 'pending' }),
      totalAmount: z.string().openapi({ example: '99.98' }),
      currency: z.string().openapi({ example: 'USD' }),
      createdAt: TimestampSchema,
      updatedAt: TimestampSchema,
    })
    .openapi('Order'),
);

export const OrderWithItemsSchema = registry.register(
  'OrderWithItems',
  z
    .object({
      id: UuidSchema,
      organizationId: z.string().openapi({ example: 'org_01j9z' }),
      userId: z.string().openapi({ example: 'usr_01j9z' }),
      status: OrderStatusEnum.openapi({ example: 'pending' }),
      totalAmount: z.string().openapi({ example: '99.98' }),
      currency: z.string().openapi({ example: 'USD' }),
      createdAt: TimestampSchema,
      updatedAt: TimestampSchema,
      items: z.array(OrderItemSchema),
    })
    .openapi('OrderWithItems'),
);

registry.registerPath({
  method: 'get',
  path: '/api/v1/orders',
  tags: ['Orders'],
  summary: 'List orders for the current user',
  responses: {
    200: {
      description: 'List of orders',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(OrderSchema) }),
        },
      },
    },
    ...commonResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/orders/{id}',
  tags: ['Orders'],
  summary: 'Get order detail with items',
  request: {
    params: z.object({ id: UuidSchema }),
  },
  responses: {
    200: {
      description: 'Order detail with items',
      content: {
        'application/json': {
          schema: z.object({ data: OrderWithItemsSchema }),
        },
      },
    },
    ...commonResponses,
  },
});
