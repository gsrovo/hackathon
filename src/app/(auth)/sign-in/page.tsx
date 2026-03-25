import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SignInForm } from '@/features/auth/components/sign-in-form';
import { GoogleOAuthButton } from '@/features/auth/components/google-oauth-button';

export default function SignInPage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GoogleOAuthButton />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>
        <SignInForm />
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-foreground underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
