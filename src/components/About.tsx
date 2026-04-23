export default function About({ text }: { text: string }) {
  // Split on double newlines to allow paragraphed About copy from the DB.
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <section
      id="about"
      className="relative border-t border-bone/10 px-6 py-24 md:px-12 md:py-36"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.28em] text-bone/55">About</p>
          <h2
            id="about-heading"
            className="mt-6 font-display text-3xl font-light leading-tight text-bone md:text-4xl"
          >
            A studio of one, working slowly.
          </h2>
        </div>
        <div className="reveal space-y-6 text-lg leading-relaxed text-bone/80 md:text-xl">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
