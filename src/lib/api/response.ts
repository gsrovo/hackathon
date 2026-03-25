import { NextResponse } from 'next/server';
import type { ApiError, ApiResponse } from '@/types/api';

export function ok<T>(
  data: T,
  message?: string,
  status = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, message }, { status });
}

export function created<T>(
  data: T,
  message?: string,
): NextResponse<ApiResponse<T>> {
  return ok(data, message, 201);
}

export function err(status: number, message: string): NextResponse<ApiError> {
  const errors: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };
  return NextResponse.json(
    { error: errors[status] ?? 'Error', message, statusCode: status },
    { status },
  );
}
