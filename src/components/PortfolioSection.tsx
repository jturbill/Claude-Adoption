"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { PortfolioPiece } from "@/lib/types";
import Lightbox from "./Lightbox";

type Props = { pieces: PortfolioPiece[] };

const ALL = "All";

export default function PortfolioSection({ pieces }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Collect unique categories, preserving first-seen order.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    pieces.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    });
    return [ALL, ...list];
  }, [pieces]);

  const visible = useMemo(
    () =>
      activeCategory === ALL
        ? pieces
        : pieces.filter((p) => p.category === activeCategory),
    [pieces, activeCategory]
  );

  return (
    <section
      id="work"
      className="relative border-t border-bone/10 px-6 py-24 md:px-12 md:py-36"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.28em] text-bone/55">Selected work</p>
            <h2
              id="work-heading"
              className="mt-6 font-display text-3xl font-light leading-tight md:text-5xl"
            >
              Recent projects
            </h2>
          </div>

          {categories.length > 1 && (
            <div
              role="tablist"
              aria-label="Filter by category"
              className="reveal flex flex-wrap gap-2"
            >
              {categories.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat)}
                    className={[
                      "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.22em] transition-colors duration-300",
                      isActive
                        ? "border-accent bg-accent text-bone"
                        : "border-bone/20 text-bone/70 hover:border-bone/40 hover:text-bone",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="text-bone/60">No pieces in this category yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {visible.map((piece, i) => (
              <li key={piece.id} className="reveal">
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group block w-full text-left"
                  aria-label={`Open ${piece.title}`}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal">
                    <Image
                      src={piece.thumbnail_url || piece.image_url}
                      alt={piece.alt_text || piece.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-cine group-hover:scale-[1.035]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-light leading-tight text-bone">
                      {piece.title}
                    </h3>
                    {piece.year && (
                      <span className="text-xs uppercase tracking-[0.22em] text-bone/50">
                        {piece.year}
                      </span>
                    )}
                  </div>
                  {piece.caption && (
                    <p className="mt-2 text-sm text-bone/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {piece.caption}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Lightbox
        pieces={visible}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </section>
  );
}
