'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps {
  variant?: 'menu-item' | 'button';
  className?: string;
}

export function SignOutButton({
  variant = 'button',
  className,
}: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/sign-in'),
      },
    });
  };

  if (variant === 'menu-item') {
    return (
      <button type="button" className={className} onClick={handleSignOut}>
        <LogOut className="size-4" />
        Sign out
      </button>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      className={className}
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
}
