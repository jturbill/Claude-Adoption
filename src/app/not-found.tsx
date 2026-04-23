import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-0 flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-bone/55">404</p>
      <h1 className="font-display text-5xl font-light md:text-7xl">Page not found</h1>
      <p className="max-w-md text-bone/70">
        That page doesn&rsquo;t exist, or it&rsquo;s been moved. Head back to the main site.
      </p>
      <Link
        href="/"
        className="text-sm uppercase tracking-[0.24em] text-accent underline underline-offset-4 hover:text-accent-soft"
      >
        Return home
      </Link>
    </main>
  );
}
