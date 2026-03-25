/**
 * Only allow same-origin relative paths to prevent open redirects.
 */
export function sanitizeCallbackUrl(
  raw: string | string[] | undefined,
  fallback = '/dashboard',
): string {
  if (raw === undefined || Array.isArray(raw)) {
    return fallback;
  }
  const v = raw.trim();
  if (v.startsWith('/') && !v.startsWith('//')) {
    return v;
  }
  return fallback;
}
