'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToOrderButtonProps {
  productId: string;
  disabled?: boolean;
}

type State = 'idle' | 'loading' | 'success' | 'error';

export function AddToOrderButton({
  productId,
  disabled,
}: AddToOrderButtonProps) {
  const [state, setState] = useState<State>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleAdd() {
    setState('loading');
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? 'Failed to create order');
        setState('error');
        setTimeout(() => setState('idle'), 3000);
        return;
      }
      setOrderId(json.data?.id ?? null);
      setState('success');
      setTimeout(() => setState('idle'), 4000);
    } catch {
      setErrorMsg('Network error');
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  if (state === 'success' && orderId) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5 border-emerald-500 text-emerald-600"
        render={<Link href={`/orders/${orderId}`} />}
      >
        <Check className="size-3.5" />
        View order
      </Button>
    );
  }

  if (state === 'error') {
    return <p className="text-destructive text-xs">{errorMsg}</p>;
  }

  return (
    <Button
      size="sm"
      onClick={handleAdd}
      disabled={disabled || state === 'loading'}
      className="gap-1.5"
    >
      {state === 'loading' ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <ShoppingBag className="size-3.5" />
      )}
      {state === 'loading' ? 'Adding…' : 'Add to order'}
    </Button>
  );
}
