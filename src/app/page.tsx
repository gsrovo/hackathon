import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-heading text-lg tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
          >
            Maison
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/sign-in" />}>
              Entrar
            </Button>
            <Button render={<Link href="/store" />}>Loja de testes</Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
        <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Badge variant="outline">Ambiente de demonstracao</Badge>
          <h1 className="font-heading text-4xl leading-tight font-semibold sm:text-5xl">
            Explore a nossa loja de testes
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Navegue pelo catalogo, simule pedidos e valide o fluxo completo da
            plataforma em um ambiente pronto para experimentar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/store" />}>
              Acessar loja
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/sign-in" />}
            >
              Fazer login
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-6 py-4 text-sm">
          <p>Maison Test Store</p>
          <p>{new Date().getFullYear()} - Hackathon Project</p>
        </div>
      </footer>
    </div>
  );
}
