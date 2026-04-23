export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-10 pt-20 md:px-12 md:pb-16 md:pt-24"
      aria-label="Introduction"
    >
      {/* Top bar — wordmark + nav */}
      <header className="flex items-center justify-between">
        <a
          href="#top"
          className="font-display text-sm uppercase tracking-[0.28em] text-bone/80 hover:text-bone"
        >
          DJD
        </a>
        <nav aria-label="Primary">
          <ul className="flex gap-6 text-xs uppercase tracking-[0.24em] text-bone/70 md:gap-10 md:text-[11px]">
            <li><a href="#about" className="hover:text-bone">About</a></li>
            <li><a href="#work" className="hover:text-bone">Work</a></li>
            <li><a href="#contact" className="hover:text-bone">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Centered wordmark */}
      <div className="mx-auto flex max-w-6xl flex-1 flex-col items-start justify-center">
        <p className="mb-6 text-xs uppercase tracking-[0.32em] text-bone/55 animate-fadeIn">
          Graphic design — est. MMXIV
        </p>
        <h1 className="font-display font-light tracking-tightest text-bone animate-fadeUp">
          <span className="block text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.92]">
            Deborah
          </span>
          <span className="block text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.92]">
            Jayne
          </span>
          <span className="block text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.92] italic text-accent">
            Designs
          </span>
        </h1>
        <p
          className="mt-10 max-w-xl text-base text-bone/70 md:text-lg animate-fadeUp"
          style={{ animationDelay: "0.15s" }}
        >
          Editorial, identity, and illustration for considered clients.
          Quiet typography, atmospheric imagery, deliberate restraint.
        </p>
      </div>

      {/* Scroll cue */}
      <div className="flex items-end justify-between">
        <span className="text-xs uppercase tracking-[0.28em] text-bone/55">Portfolio</span>
        <a
          href="#work"
          className="group flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-bone/70 hover:text-bone"
        >
          Scroll
          <span
            className="inline-block h-8 w-px bg-bone/40 transition-all duration-700 ease-cine group-hover:h-12 group-hover:bg-accent"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}
