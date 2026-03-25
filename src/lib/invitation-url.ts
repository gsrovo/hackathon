/**
 * Public URL for accepting an organization invitation (Scenario A: nominative email + link delivery).
 */
export function getAcceptInvitationPath(invitationId: string): string {
  return `/accept-invitation/${invitationId}`;
}

function getPublicAppOrigin(): string {
  const raw =
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  return raw.replace(/\/$/, '');
}

export function getAbsoluteAcceptInvitationUrl(invitationId: string): string {
  const base = getPublicAppOrigin();
  if (!base) {
    return getAcceptInvitationPath(invitationId);
  }
  return `${base}${getAcceptInvitationPath(invitationId)}`;
}
