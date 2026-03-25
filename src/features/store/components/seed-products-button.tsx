'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SeedProductsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSeed() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/dev/seed', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to seed products');
        return;
      }
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleSeed} disabled={loading} className="gap-2">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {loading ? 'Creating…' : 'Add sample products'}
      </Button>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
