"use client";

import { useState, useTransition } from "react";
import { updateAboutAction } from "@/app/admin/actions";

export default function AboutEditor({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("idle");
    const formData = new FormData(e.currentTarget);

    start(async () => {
      const result = await updateAboutAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-ink/70">About text</span>
        <textarea
          name="about"
          rows={12}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full border border-ink/20 bg-bone px-3 py-3 text-ink leading-relaxed focus:border-accent focus:outline-none"
          required
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-accent-deep">
          {error}
        </p>
      )}
      {status === "saved" && (
        <p role="status" className="text-sm text-accent-deep">
          Saved. The homepage updates within a minute.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-bone hover:bg-accent disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
