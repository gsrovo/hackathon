import { NextResponse } from 'next/server';
import { getOpenApiSpec } from '@/lib/api/openapi/spec';

export function GET() {
  const spec = getOpenApiSpec();
  return NextResponse.json(spec);
}
