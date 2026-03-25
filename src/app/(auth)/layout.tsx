export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen">
      {/* Brand panel */}
      <div className="bg-primary text-primary-foreground hidden w-1/2 flex-col justify-between p-16 lg:flex">
        <span className="font-heading text-2xl tracking-[0.3em] uppercase">
          Maison
        </span>
        <div>
          <p className="font-heading text-5xl leading-tight font-light">
            Curated for
            <br />
            the discerning.
          </p>
          <p className="text-primary-foreground/50 mt-6 text-sm tracking-wide">
            Members-only access to exclusive collections and bespoke services.
          </p>
        </div>
        <p className="text-primary-foreground/30 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Maison
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <span className="font-heading text-foreground mb-10 block text-center text-xl tracking-[0.3em] uppercase lg:hidden">
            Maison
          </span>
          {children}
        </div>
      </div>
    </div>
  );
}
