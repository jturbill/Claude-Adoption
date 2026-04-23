"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import type { PortfolioPiece } from "@/lib/types";
import { createPieceAction, updatePieceAction, type ActionResult } from "@/app/admin/actions";

type Props = {
  mode: "create" | "edit";
  piece?: PortfolioPiece;
};

export default function PieceForm({ mode, piece }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(piece?.image_url ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function applyFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(String(e.target?.result ?? ""));
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && formRef.current) {
      // Also copy the dropped file into the hidden file input so it submits.
      const input = formRef.current.querySelector<HTMLInputElement>('input[name="image"]');
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
      }
      applyFile(file);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    start(async () => {
      const action = mode === "create" ? createPieceAction : updatePieceAction;
      const result = (await action(formData)) as ActionResult | undefined;
      // A successful action redirects server-side, so we only see a result here
      // when something went wrong.
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-8" noValidate>
      {mode === "edit" && <input type="hidden" name="id" value={piece!.id} />}

      {/* Drop zone / preview */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={[
          "block cursor-pointer rounded-sm border-2 border-dashed bg-bone p-4 transition-colors",
          dragging ? "border-accent bg-accent/5" : "border-ink/20 hover:border-ink/40",
        ].join(" ")}
      >
        {preview ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative h-44 w-full flex-shrink-0 overflow-hidden bg-ink/10 md:h-40 md:w-56">
              <Image
                src={preview}
                alt="Selected image preview"
                fill
                sizes="240px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="text-sm text-ink/70">
              <p className="font-medium text-ink">
                {fileName || (mode === "edit" ? "Current image" : "Image selected")}
              </p>
              <p className="mt-1 text-xs text-ink/55">
                Drop a new image here or click to replace. Max 12 MB. JPEG or PNG.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-ink/60">
            <p className="text-sm">Drag &amp; drop an image here, or click to choose.</p>
            <p className="text-xs text-ink/45">Max 12 MB. JPEG or PNG.</p>
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="sr-only"
          onChange={(e) => applyFile(e.target.files?.[0])}
        />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" required>
          <input
            type="text"
            name="title"
            required
            defaultValue={piece?.title}
            className={inputClass}
          />
        </Field>
        <Field label="Category" hint="e.g. Editorial, Identity, Illustration">
          <input
            type="text"
            name="category"
            defaultValue={piece?.category ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            name="year"
            min={1900}
            max={2100}
            defaultValue={piece?.year ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="Display order"
          hint="Lower numbers appear first. Leave 0 to place at top."
        >
          <input
            type="number"
            name="display_order"
            defaultValue={piece?.display_order ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="Alt text"
        required
        hint="A short description of what the image shows, for screen readers."
      >
        <input
          type="text"
          name="alt_text"
          required
          defaultValue={piece?.alt_text}
          className={inputClass}
        />
      </Field>

      <Field label="Caption" hint="One short line shown on hover in the grid.">
        <input
          type="text"
          name="caption"
          defaultValue={piece?.caption ?? ""}
          className={inputClass}
        />
      </Field>

      <Field
        label="Write-up"
        hint="200–400 words. Markdown supported (paragraphs, **bold**, *italic*, links)."
      >
        <textarea
          name="writeup"
          rows={10}
          defaultValue={piece?.writeup ?? ""}
          className={`${inputClass} font-sans leading-relaxed`}
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-accent-deep">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-bone hover:bg-accent disabled:opacity-50"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Publish piece"
              : "Save changes"}
        </button>
        <a
          href="/admin"
          className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 w-full border border-ink/20 bg-bone px-3 py-2.5 text-ink placeholder-ink/40 focus:border-accent focus:outline-none";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-ink/70">
          {label}
          {required && <span className="ml-1 text-accent-deep">*</span>}
        </span>
        {hint && <span className="text-[11px] text-ink/45">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
