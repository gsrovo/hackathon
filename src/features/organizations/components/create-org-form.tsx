'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const createOrgSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
});

type CreateOrgValues = z.infer<typeof createOrgSchema>;

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CreateOrgForm() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { name: '', slug: '' },
  });

  const slugValue = useWatch({ control, name: 'slug' });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nameValue = e.target.value;
    setValue('name', nameValue);
    setValue('slug', toSlug(nameValue));
  }

  async function onSubmit(values: CreateOrgValues) {
    setFeedback(null);

    const payload: { name: string; slug?: string } = { name: values.name };
    if (values.slug && values.slug.trim() !== '') {
      payload.slug = values.slug.trim();
    }

    const res = await fetch('/api/v1/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setFeedback({
        type: 'error',
        message: json.message ?? 'Failed to create organization',
      });
      return;
    }

    const json = await res.json();
    const org = json.data ?? json;
    router.push(`/organizations/${org.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
          Create organization
        </CardTitle>
        <CardDescription className="tracking-wide">
          Set up a new organization to collaborate with your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Organization name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Acme Corp"
              autoComplete="organization"
              {...register('name', {
                onChange: handleNameChange,
              })}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">
              Slug{' '}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="slug"
              type="text"
              placeholder="acme-corp"
              {...register('slug')}
            />
            {slugValue && (
              <p className="text-muted-foreground text-xs">
                URL-friendly identifier:{' '}
                <span className="font-mono">{slugValue}</span>
              </p>
            )}
            {errors.slug && (
              <p className="text-destructive text-sm">{errors.slug.message}</p>
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
            {isSubmitting ? 'Creating…' : 'Create organization'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
