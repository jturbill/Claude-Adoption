import type { ReactNode } from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative z-10 min-h-screen bg-parchment text-ink">
      <header className="border-b border-ink/10 bg-bone">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-10">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-lg tracking-tight">
              DJD Admin
            </Link>
            <nav className="flex gap-5 text-sm text-ink/70">
              <Link href="/admin" className="hover:text-ink">
                Pieces
              </Link>
              <Link href="/admin/new" className="hover:text-ink">
                Add new
              </Link>
              <Link href="/admin/about" className="hover:text-ink">
                About
              </Link>
              <Link href="/" className="hover:text-ink" target="_blank">
                View site ↗
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink/60">
            <span className="hidden md:inline">{user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">{children}</main>
    </div>
  );
}
