"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    startTransition(() => {
      router.replace(next);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-bone/60">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-bone/20 bg-transparent px-3 py-2.5 text-bone focus:border-accent focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-bone/60">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-bone/20 bg-transparent px-3 py-2.5 text-bone focus:border-accent focus:outline-none"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-accent-soft">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent px-4 py-3 text-sm uppercase tracking-[0.24em] text-bone transition-colors hover:bg-accent-soft disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="pt-2 text-xs text-bone/50">
        Forgot your password? See the README for reset steps.
      </p>
    </form>
  );
}
