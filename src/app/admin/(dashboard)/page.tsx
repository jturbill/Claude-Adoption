import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PortfolioPiece } from "@/lib/types";
import DashboardList from "@/components/admin/DashboardList";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const pieces = (data ?? []) as PortfolioPiece[];

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
            Portfolio pieces
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Drag to reorder. The public site updates within a minute.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-block bg-ink px-4 py-2.5 text-xs uppercase tracking-[0.22em] text-bone hover:bg-accent"
        >
          Add new piece
        </Link>
      </div>

      <div className="mt-8">
        {pieces.length === 0 ? (
          <div className="rounded-sm border border-dashed border-ink/20 p-10 text-center text-ink/60">
            <p className="mb-3">No pieces yet.</p>
            <Link href="/admin/new" className="text-accent underline underline-offset-4">
              Add the first one →
            </Link>
          </div>
        ) : (
          <DashboardList pieces={pieces} />
        )}
      </div>
    </div>
  );
}
