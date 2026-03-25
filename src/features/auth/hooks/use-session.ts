'use client';

import { authClient } from '@/lib/auth-client';

export function useSession() {
  return authClient.useSession();
}

export function useActiveOrganization() {
  return authClient.useActiveOrganization();
}
