import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organization } from './auth';
import { orderItems } from './orders';

export const PRODUCT_STATUS = ['active', 'draft', 'archived'] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  sku: text('sku').unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  status: text('status').$type<ProductStatus>().notNull().default('draft'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));
