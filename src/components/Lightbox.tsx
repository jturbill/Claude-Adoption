"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { PortfolioPiece } from "@/lib/types";

type Props = {
  pieces: PortfolioPiece[];
  openIndex: number | null;
  onClose: () => void;
  onChange: (next: number | null) => void;
};

export default function Lightbox({ pieces, openIndex, onClose, onChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const open = openIndex !== null;
  const piece = open ? pieces[openIndex!] : null;

  // Lock body scroll + handle keyboard navigation.
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && openIndex! < pieces.length - 1) {
        onChange(openIndex! + 1);
      } else if (e.key === "ArrowLeft" && openIndex! > 0) {
        onChange(openIndex! - 1);
      }
    };
    window.addEventListener("keydown", onKey);

    // Move focus into the dialog for screen readers.
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, openIndex, pieces.length, onClose, onChange]);

  if (!open || !piece) return null;

  const hasPrev = openIndex! > 0;
  const hasNext = openIndex! < pieces.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={piece.title}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink/95 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <span className="pointer-events-auto text-xs uppercase tracking-[0.28em] text-bone/60">
          {openIndex! + 1} / {pieces.length}
        </span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="pointer-events-auto text-xs uppercase tracking-[0.28em] text-bone/80 hover:text-accent"
          aria-label="Close"
        >
          Close ✕
        </button>
      </div>

      {/* Prev / Next */}
      {hasPrev && (
        <button
          type="button"
          onClick={() => onChange(openIndex! - 1)}
          aria-label="Previous piece"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-bone/15 bg-ink/60 p-3 text-bone/80 backdrop-blur hover:border-accent hover:text-accent md:left-6"
        >
          <ArrowLeftIcon />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={() => onChange(openIndex! + 1)}
          aria-label="Next piece"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-bone/15 bg-ink/60 p-3 text-bone/80 backdrop-blur hover:border-accent hover:text-accent md:right-6"
        >
          <ArrowRightIcon />
        </button>
      )}

      {/* Content */}
      <div className="relative z-0 grid h-full w-full grid-rows-[1fr_auto] overflow-auto md:grid-cols-[1.6fr_1fr] md:grid-rows-none">
        <figure className="relative flex items-center justify-center bg-charcoal p-4 md:p-10">
          <div className="relative h-[60vh] w-full md:h-[calc(100vh-4rem)]">
            <Image
              src={piece.image_url}
              alt={piece.alt_text || piece.title}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-contain"
              priority
            />
          </div>
        </figure>

        <aside className="flex flex-col justify-center gap-5 border-bone/10 px-6 py-10 md:border-l md:px-10 md:py-16">
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-bone/55">
            {piece.category && <span>{piece.category}</span>}
            {piece.year && <span>{piece.year}</span>}
          </div>
          <h2 className="font-display text-3xl font-light leading-tight md:text-4xl">
            {piece.title}
          </h2>
          {piece.caption && (
            <p className="text-base text-bone/75 md:text-lg">{piece.caption}</p>
          )}
          {piece.writeup && (
            <div className="prose-djd mt-2 text-base md:text-[15px]">
              <ReactMarkdown>{piece.writeup}</ReactMarkdown>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
