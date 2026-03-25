import {
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organization } from './auth';

export const SUBSCRIPTION_STATUS = [
  'active',
  'trialing',
  'past_due',
  'cancelled',
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

export const billingPlans = pgTable('billing_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  priceMonthly: numeric('price_monthly', { precision: 10, scale: 2 }).notNull(),
  priceYearly: numeric('price_yearly', { precision: 10, scale: 2 }).notNull(),
  features: jsonb('features').notNull().default('[]'),
});

export const organizationSubscriptions = pgTable('organization_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => billingPlans.id),
  status: text('status')
    .$type<SubscriptionStatus>()
    .notNull()
    .default('trialing'),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubId: text('stripe_sub_id'),
});

export const billingPlansRelations = relations(billingPlans, ({ many }) => ({
  subscriptions: many(organizationSubscriptions),
}));

export const organizationSubscriptionsRelations = relations(
  organizationSubscriptions,
  ({ one }) => ({
    plan: one(billingPlans, {
      fields: [organizationSubscriptions.planId],
      references: [billingPlans.id],
    }),
  }),
);
