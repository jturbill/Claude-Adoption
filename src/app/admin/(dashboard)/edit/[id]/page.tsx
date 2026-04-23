import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PortfolioPiece } from "@/lib/types";
import PieceForm from "@/components/admin/PieceForm";

export const dynamic = "force-dynamic";

export default async function EditPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();
  const piece = data as PortfolioPiece;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-light tracking-tight md:text-4xl">
        Edit piece
      </h1>
      <p className="mt-2 text-sm text-ink/60">{piece.title}</p>
      <div className="mt-10">
        <PieceForm mode="edit" piece={piece} />
      </div>
    </div>
  );
}
