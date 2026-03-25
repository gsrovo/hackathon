import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'Organizations',
    description:
      'Create workspaces, invite members via link, and manage roles — all within a multi-tenant architecture built for teams.',
  },
  {
    title: 'Authentication',
    description:
      'Secure sign-in and sign-up flows with session management, protected routes, and smooth redirect handling.',
  },
  {
    title: 'Store & Catalog',
    description:
      'Browse a product catalog, simulate purchases, and explore the full commerce experience end to end.',
  },
  {
    title: 'Order Management',
    description:
      'Track orders from placement to delivery with a structured order history and detail view.',
  },
  {
    title: 'User Profiles',
    description:
      'Manage account details and avatar in a personal profile page with real-time form feedback.',
  },
  {
    title: 'API Layer',
    description:
      'A typed REST API documented with Swagger UI — ready to explore, test, and extend.',
  },
];

const stack = [
  'Next.js 16',
  'TypeScript',
  'Tailwind 4',
  'shadcn/ui',
  'Drizzle ORM',
  'PostgreSQL',
  'better-auth',
  'Zod',
];

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-heading text-lg tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
          >
            Maison
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/sign-in" />}>
              Sign in
            </Button>
            <Button render={<Link href="/store" />}>Open store</Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center sm:py-32">
          <Badge variant="outline" className="tracking-widest uppercase">
            Hackathon 2026
          </Badge>
          <h1 className="font-heading max-w-3xl text-5xl leading-[1.1] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            A platform built for modern teams
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            Maison is a full-stack SaaS demo — multi-tenant organizations,
            authenticated users, a product store, and order management, all in
            one cohesive platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/store" />}>
              Explore the store
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/sign-up" />}
            >
              Create account
            </Button>
          </div>
        </section>

        <Separator />

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mb-12 flex flex-col gap-3">
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
              Platform
            </p>
            <h2 className="font-heading max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to explore the full flow
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-muted/30 border-border/60 hover:bg-muted/60 transition-colors"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Stack */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
                Built with
              </p>
              <h2 className="font-heading max-w-xs text-3xl font-semibold tracking-tight">
                Modern, production-grade stack
              </h2>
            </div>
            <div className="flex max-w-sm flex-wrap gap-2">
              {stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="bg-muted/40 flex flex-col items-center gap-6 rounded-2xl px-8 py-16 text-center">
            <h2 className="font-heading max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to explore?
            </h2>
            <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
              Sign up, create an organization, and walk through the full
              platform — no configuration needed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/sign-up" />}>
                Get started
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/api-docs" />}
              >
                View API docs
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-6 py-5 text-sm">
          <p className="font-heading tracking-[0.15em] uppercase">Maison</p>
          <p>{new Date().getFullYear()} — Hackathon Project</p>
        </div>
      </footer>
    </div>
  );
}
