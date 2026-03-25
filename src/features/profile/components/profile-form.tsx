'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialName: string;
  email: string;
  initialImage?: string | null;
}

export function ProfileForm({
  initialName,
  email,
  initialImage,
}: ProfileFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
    },
  });

  async function onSubmit(values: ProfileValues) {
    setFeedback(null);

    const res = await fetch('/api/v1/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: values.name }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setFeedback({
        type: 'error',
        message: json.error ?? 'Failed to update profile',
      });
      return;
    }

    setFeedback({ type: 'success', message: 'Profile updated.' });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
          Personal information
        </CardTitle>
        <CardDescription className="tracking-wide">
          Update your name and profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Avatar */}
          {initialImage && (
            <div className="flex items-center gap-3">
              <Image
                src={initialImage}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Email — read-only */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className="text-muted-foreground"
            />
            <p className="text-muted-foreground text-xs">
              Email cannot be changed here.
            </p>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {feedback && (
            <p
              className={
                feedback.type === 'success'
                  ? 'text-sm text-green-600'
                  : 'text-destructive text-sm'
              }
            >
              {feedback.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="self-start">
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
