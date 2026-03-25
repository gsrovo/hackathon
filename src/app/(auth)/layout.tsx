import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/features/auth/lib/auth';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/dashboard');
  return (
    <div className="flex min-h-screen">
      {/* Brand panel — always dark */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-16 lg:flex"
        style={{ background: 'oklch(0.07 0.018 280)' }}
      >
        {/* Ambient glow orbs */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute -top-16 -left-32 h-175 w-175"
            style={{
              background:
                'radial-gradient(ellipse, oklch(0.32 0.25 280 / 25%) 0%, transparent 68%)',
            }}
          />
          <div
            className="absolute right-0 bottom-0 h-125 w-125"
            style={{
              background:
                'radial-gradient(ellipse, oklch(0.45 0.28 295 / 18%) 0%, transparent 65%)',
            }}
          />
        </div>

        {/* Tech grid overlay */}
        <div
          className="brand-grid-dark pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
        />

        {/* Glowing concentric rings */}
        <div
          className="pointer-events-none absolute top-1/2 left-12 size-105 -translate-y-1/2 rounded-full border border-white/8"
          style={{
            boxShadow:
              '0 0 80px oklch(0.62 0.26 280 / 22%), inset 0 0 60px oklch(0.62 0.26 280 / 6%)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 left-24 size-67.5 -translate-y-[45%] rounded-full border border-white/5"
          style={{ boxShadow: '0 0 50px oklch(0.62 0.26 280 / 15%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 left-36 size-35 -translate-y-[40%] rounded-full border border-white/5"
          style={{ boxShadow: '0 0 30px oklch(0.82 0.1 82 / 18%)' }}
          aria-hidden="true"
        />

        {/* Brand wordmark */}
        <span className="text-gradient font-heading relative text-2xl tracking-[0.35em] uppercase">
          Maison
        </span>

        {/* Hero copy */}
        <div className="relative">
          <p
            className="font-heading text-[3.5rem] leading-[1.08] font-light"
            style={{ color: 'oklch(0.96 0.005 275 / 90%)' }}
          >
            Intelligence
            <br />
            meets
            <br />
            <span className="text-gradient">refinement.</span>
          </p>
          <p
            className="mt-8 font-mono text-xs tracking-wider"
            style={{ color: 'oklch(0.96 0.005 275 / 30%)' }}
          >
            {`// Members-only access to exclusive collections`}
          </p>
        </div>

        {/* Footer */}
        <p
          className="relative font-mono text-xs tracking-widest uppercase"
          style={{ color: 'oklch(0.96 0.005 275 / 20%)' }}
        >
          © {new Date().getFullYear()} Maison
        </p>
      </div>

      {/* Form panel — light */}
      <div className="bg-background relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <span className="text-gradient font-heading mb-10 block text-center text-xl tracking-[0.35em] uppercase lg:hidden">
            Maison
          </span>
          {children}
        </div>
      </div>
    </div>
  );
}
