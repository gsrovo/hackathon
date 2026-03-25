import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';

// Side-effect imports — each file registers its routes into the registry
import './schemas/common.schemas';

function buildSpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'E-Commerce Multi-Org API',
      version: '1.0.0',
      description:
        'REST API for the multi-organization e-commerce account dashboard. ' +
        'All `/api/v1/*` endpoints require authentication via BetterAuth session cookie. ' +
        'Organization-scoped endpoints additionally require membership and a minimum role.',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
        description: 'Current environment',
      },
    ],
  });
}

// Module-level singleton — generated once per server cold start
let cachedSpec: ReturnType<typeof buildSpec> | null = null;

export function getOpenApiSpec() {
  if (!cachedSpec) {
    cachedSpec = buildSpec();
  }
  return cachedSpec;
}
