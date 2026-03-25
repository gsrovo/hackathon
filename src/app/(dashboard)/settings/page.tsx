import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/features/auth/lib/auth';
import { PageHeader } from '@/components/shared/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/sign-in');

  const { user } = session;

  return (
    <>
      <PageHeader title="Settings" description="Account preferences" />
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <div className="max-w-xl space-y-6">
          {/* Profile section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl font-light tracking-wide">
                Profile
              </CardTitle>
              <CardDescription className="tracking-wide">
                Manage your personal information and avatar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" render={<Link href="/profile" />}>
                Edit profile
              </Button>
            </CardContent>
          </Card>

          {/* Session section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl font-light tracking-wide">
                Session
              </CardTitle>
              <CardDescription className="tracking-wide">
                Your current session details.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Email
                </p>
                <p className="font-mono text-sm">{user.email}</p>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Name
                </p>
                <p className="text-sm">{user.name}</p>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  User ID
                </p>
                <p className="text-muted-foreground font-mono text-xs">
                  {user.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl font-light tracking-wide">
                Account
              </CardTitle>
              <CardDescription className="tracking-wide">
                Manage your account access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                size="sm"
                render={<Link href="/api/auth/sign-out" />}
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
