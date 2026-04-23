export default function Contact() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@deborahjaynedesigns.com";

  return (
    <section
      id="contact"
      className="relative border-t border-bone/10 px-6 py-28 md:px-12 md:py-40"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="reveal text-xs uppercase tracking-[0.28em] text-bone/55">Get in touch</p>
        <h2
          id="contact-heading"
          className="reveal mt-6 font-display text-4xl font-light leading-[1.05] md:text-6xl"
        >
          Considering a new project?
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-base text-bone/70 md:text-lg">
          Tell me about the work — what it is, who it&rsquo;s for, and where it needs to end up.
        </p>
        <a
          href={`mailto:${email}`}
          className="reveal mt-10 inline-block font-display text-2xl italic text-accent underline decoration-accent/40 decoration-1 underline-offset-8 transition-colors hover:text-accent-soft md:text-3xl"
        >
          {email}
        </a>

        <ul className="reveal mt-12 flex items-center justify-center gap-8 text-xs uppercase tracking-[0.24em] text-bone/55">
          <li>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-bone"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://www.are.na/"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-bone"
            >
              Are.na
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-bone"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
