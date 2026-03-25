import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SignUpForm } from '@/features/auth/components/sign-up-form';
import { GoogleOAuthButton } from '@/features/auth/components/google-oauth-button';

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-3xl font-light tracking-wide">
          Join Maison
        </CardTitle>
        <CardDescription className="tracking-wide">
          Create your exclusive account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GoogleOAuthButton />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>
        <SignUpForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
