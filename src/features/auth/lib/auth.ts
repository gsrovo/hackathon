import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { getAbsoluteAcceptInvitationUrl } from '@/lib/invitation-url';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      async sendInvitationEmail(data) {
        const url = getAbsoluteAcceptInvitationUrl(data.id);
        if (process.env.NODE_ENV === 'development') {
          console.info('[invitation] copy this link for', data.email, '→', url);
        }
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
