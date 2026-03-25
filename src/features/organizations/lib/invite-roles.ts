/** Roles allowed when inviting; owners are not grantable via invite. */
export const ORG_INVITE_ROLES = ['admin', 'member'] as const;

export type OrgInviteRole = (typeof ORG_INVITE_ROLES)[number];
